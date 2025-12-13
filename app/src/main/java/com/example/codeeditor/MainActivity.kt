package com.example.codeeditor

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ArrowBackIosNew
import androidx.compose.material.icons.outlined.Code
import androidx.compose.material.icons.outlined.Folder
import androidx.compose.material.icons.outlined.Menu
import androidx.compose.material.icons.outlined.MoreHoriz
import androidx.compose.material.icons.outlined.PlayArrow
import androidx.compose.material.icons.outlined.Save
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.rememberTopAppBarState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.codeeditor.ui.theme.CodeEditorTheme
import com.example.codeeditor.ui.theme.EditorBackground
import com.example.codeeditor.ui.theme.EditorGutter
import com.example.codeeditor.ui.theme.PrimaryBlue
import com.example.codeeditor.ui.theme.SyntaxComment
import com.example.codeeditor.ui.theme.SyntaxFunction
import com.example.codeeditor.ui.theme.SyntaxKeyword
import com.example.codeeditor.ui.theme.SyntaxString
import com.example.codeeditor.ui.theme.SyntaxVariable

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CodeEditorApp()
        }
    }
}

sealed class Screen {
    object Explorer : Screen()
    object Search : Screen()
    object Terminal : Screen()
    object Settings : Screen()
    object Editor : Screen()
}

data class BottomNavItem(
    val screen: Screen,
    val label: String,
    val icon: ImageVector
)

@Composable
fun CodeEditorApp() {
    CodeEditorTheme {
        var currentScreen by remember { mutableStateOf<Screen>(Screen.Explorer) }

        val bottomNavItems = remember {
            listOf(
                BottomNavItem(Screen.Explorer, "Explorer", Icons.Outlined.Folder),
                BottomNavItem(Screen.Search, "Search", Icons.Outlined.Search),
                BottomNavItem(Screen.Terminal, "Terminal", Icons.Outlined.Code),
                BottomNavItem(Screen.Settings, "Settings", Icons.Outlined.Settings)
            )
        }

        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
        ) {
            Scaffold(
                bottomBar = {
                    if (currentScreen != Screen.Editor) {
                        NavigationBar(
                            containerColor = MaterialTheme.colorScheme.surface.copy(alpha = 0.97f)
                        ) {
                            bottomNavItems.forEach { item ->
                                val selected = currentScreen == item.screen
                                NavigationBarItem(
                                    selected = selected,
                                    onClick = { currentScreen = item.screen },
                                    icon = {
                                        Icon(
                                            imageVector = item.icon,
                                            contentDescription = item.label
                                        )
                                    },
                                    label = {
                                        Text(
                                            text = item.label,
                                            fontSize = 11.sp
                                        )
                                    }
                                )
                            }
                        }
                    }
                },
                floatingActionButton = {
                    if (currentScreen == Screen.Explorer) {
                        FloatingActionButton(
                            onClick = { /* TODO: run project */ },
                            containerColor = PrimaryBlue,
                            contentColor = Color.White
                        ) {
                            Icon(
                                imageVector = Icons.Outlined.PlayArrow,
                                contentDescription = "Run"
                            )
                        }
                    }
                }
            ) { innerPadding ->
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(innerPadding)
                ) {
                    when (currentScreen) {
                        Screen.Explorer -> ProjectExplorerScreen(
                            onOpenFile = { currentScreen = Screen.Editor }
                        )

                        Screen.Search -> PlaceholderScreen(title = "Search", description = "Layar pencarian global akan ditambahkan di sini.")
                        Screen.Terminal -> PlaceholderScreen(title = "Terminal", description = "Layar terminal akan ditambahkan di sini.")
                        Screen.Settings -> SettingsScreen()
                        Screen.Editor -> CodeEditorScreen(
                            onClose = { currentScreen = Screen.Explorer }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun PlaceholderScreen(
    title: String,
    description: String
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleLarge
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )
        }
    }
}

/**
 * Project Explorer screen based on penjelajah_berkas/proyek_1/code.html design
 */
@Composable
fun ProjectExplorerScreen(
    onOpenFile: () -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(scrollState)
    ) {
        ExplorerHeader()
        Spacer(modifier = Modifier.height(8.dp))
        ExplorerSearchBar()
        Spacer(modifier = Modifier.height(8.dp))
        ExplorerBreadcrumbs()
        Spacer(modifier = Modifier.height(8.dp))
        ExplorerPrimaryActions()
        Spacer(modifier = Modifier.height(4.dp))
        ExplorerFileTree(onOpenFile = onOpenFile)
        Spacer(modifier = Modifier.height(24.dp))
        ExplorerFooter()
        Spacer(modifier = Modifier.height(80.dp))
    }
}

@Composable
private fun ExplorerHeader() {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.background.copy(alpha = 0.98f)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            IconButton(onClick = { /* TODO: back */ }) {
                Icon(
                    imageVector = Icons.Outlined.ArrowBackIosNew,
                    contentDescription = "Back"
                )
            }

            Column(
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "MyAwesomeApp",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold
                    )
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Workspace",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontWeight = FontWeight.Medium,
                            fontSize = 10.sp,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                    )
                    Box(
                        modifier = Modifier
                            .padding(horizontal = 4.dp)
                            .size(3.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f))
                    )
                    Text(
                        text = "main*",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontWeight = FontWeight.Medium,
                            fontSize = 10.sp,
                            color = PrimaryBlue
                        )
                    )
                }
            }

            IconButton(onClick = { /* TODO: more */ }) {
                Icon(
                    imageVector = Icons.Outlined.MoreHoriz,
                    contentDescription = "More"
                )
            }
        }
    }
}

@Composable
private fun ExplorerSearchBar() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .background(
                color = MaterialTheme.colorScheme.surface,
                shape = RoundedCornerShape(16.dp)
            )
            .padding(horizontal = 12.dp, vertical = 8.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Outlined.Search,
                contentDescription = "Search",
                tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Search files (Cmd+P)...",
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                    fontSize = 13.sp
                )
            )
            Spacer(modifier = Modifier.weight(1f))
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(
                        MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.7f)
                    )
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            ) {
                Text(
                    text = "⌘ P",
                    style = MaterialTheme.typography.bodySmall.copy(
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Medium,
                        fontSize = 10.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                )
            }
        }
    }
}

@Composable
private fun ExplorerBreadcrumbs() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        BreadcrumbChip(
            label = "root",
            icon = Icons.Outlined.Code,
            background = MaterialTheme.colorScheme.surface,
            contentColor = MaterialTheme.colorScheme.onSurface
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = ">",
            style = MaterialTheme.typography.bodySmall.copy(
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
            ),
            modifier = Modifier.padding(horizontal = 4.dp)
        )
        BreadcrumbChip(
            label = "src",
            icon = Icons.Outlined.Folder,
            background = MaterialTheme.colorScheme.surface,
            contentColor = MaterialTheme.colorScheme.onSurface
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = ">",
            style = MaterialTheme.typography.bodySmall.copy(
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
            ),
            modifier = Modifier.padding(horizontal = 4.dp)
        )
        BreadcrumbChip(
            label = "components",
            icon = Icons.Outlined.Folder,
            background = PrimaryBlue.copy(alpha = 0.1f),
            contentColor = PrimaryBlue
        )
    }
}

@Composable
private fun BreadcrumbChip(
    label: String,
    icon: ImageVector,
    background: Color,
    contentColor: Color
) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .background(background)
            .padding(horizontal = 8.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = contentColor,
            modifier = Modifier.size(16.dp)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall.copy(
                color = contentColor,
                fontWeight = FontWeight.Medium
            )
        )
    }
}

@Composable
private fun ExplorerPrimaryActions() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Box(
            modifier = Modifier
                .weight(1f)
                .clip(RoundedCornerShape(12.dp))
                .background(PrimaryBlue)
                .clickable { }
                .padding(vertical = 10.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Outlined.Code,
                    contentDescription = null,
                    tint = Color.White
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "New File",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = Color.White,
                        fontWeight = FontWeight.SemiBold
                    )
                )
            }
        }

        Box(
            modifier = Modifier
                .weight(1f)
                .clip(RoundedCornerShape(12.dp))
                .background(MaterialTheme.colorScheme.surface)
                .clickable { }
                .padding(vertical = 10.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Outlined.Folder,
                    contentDescription = null
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "New Folder",
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }
    }
}

@Composable
private fun ExplorerFileTree(
    onOpenFile: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp)
    ) {
        ExplorerFileRow(
            indent = 0,
            label = ".vscode",
            icon = Icons.Outlined.Folder,
            iconTint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
        )

        ExplorerFileRow(
            indent = 0,
            label = "node_modules",
            icon = Icons.Outlined.Folder,
            iconTint = Color(0xFF059669),
            labelColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
        )

        ExplorerFileRow(
            indent = 0,
            label = "src",
            icon = Icons.Outlined.Folder,
            iconTint = Color(0xFFFBBF24),
            isBold = true,
            hasIndicator = true
        )

        ExplorerFileRow(
            indent = 1,
            label = "assets",
            icon = Icons.Outlined.Folder,
            iconTint = Color(0xFFA855F7)
        )

        ExplorerFileRow(
            indent = 1,
            label = "components",
            icon = Icons.Outlined.Folder,
            iconTint = PrimaryBlue,
            isBold = false
        )

        ExplorerFileRow(
            indent = 2,
            label = "Header.tsx",
            icon = Icons.Outlined.Code,
            iconTint = Color(0xFF22D3EE),
            labelColor = Color(0xFFFBBF24),
            metadata = "M"
        )

        ExplorerFileRow(
            indent = 2,
            label = "Button.tsx",
            icon = Icons.Outlined.Code,
            iconTint = Color(0xFF22D3EE),
            labelColor = Color(0xFF34D399),
            metadata = "U"
        )

        ExplorerFileRow(
            indent = 1,
            label = "App.tsx",
            icon = Icons.Outlined.Code,
            iconTint = Color(0xFF22D3EE),
            labelColor = PrimaryBlue,
            metadata = "A",
            isBold = true,
            isSelected = true,
            onClick = onOpenFile
        )

        ExplorerFileRow(
            indent = 1,
            label = "index.css",
            icon = Icons.Outlined.Code,
            iconTint = Color(0xFF60A5FA)
        )

        ExplorerFileRow(
            indent = 0,
            label = ".gitignore",
            icon = Icons.Outlined.Code,
            iconTint = Color(0xFFF97316)
        )

        ExplorerFileRow(
            indent = 0,
            label = "package.json",
            icon = Icons.Outlined.Code,
            iconTint = Color(0xFFF97373),
            metadata = "!"
        )

        ExplorerFileRow(
            indent = 0,
            label = "README.md",
            icon = Icons.Outlined.Code,
            iconTint = Color(0xFF60A5FA)
        )
    }
}

@Composable
private fun ExplorerFileRow(
    indent: Int,
    label: String,
    icon: ImageVector,
    iconTint: Color,
    labelColor: Color = MaterialTheme.colorScheme.onSurface,
    metadata: String? = null,
    isSelected: Boolean = false,
    isBold: Boolean = false,
    hasIndicator: Boolean = false,
    onClick: (() -> Unit)? = null
) {
    val background = when {
        isSelected -> PrimaryBlue.copy(alpha = 0.1f)
        else -> Color.Transparent
    }

    val borderColor = when {
        isSelected -> PrimaryBlue.copy(alpha = 0.4f)
        else -> Color.Transparent
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 4.dp, vertical = 2.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(background)
            .then(
                if (onClick != null) {
                    Modifier.clickable(onClick = onClick)
                } else {
                    Modifier
                }
            )
            .padding(horizontal = 8.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Spacer(modifier = Modifier.width((indent * 16).dp))

        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = iconTint,
            modifier = Modifier.size(18.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium.copy(
                fontWeight = if (isBold) FontWeight.Bold else FontWeight.Medium,
                color = labelColor
            )
        )

        if (hasIndicator) {
            Spacer(modifier = Modifier.width(6.dp))
            Box(
                modifier = Modifier
                    .size(6.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFFBBF24))
            )
        }

        Spacer(modifier = Modifier.weight(1f))

        if (metadata != null) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(
                        if (isSelected) PrimaryBlue else MaterialTheme.colorScheme.surfaceVariant
                    )
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            ) {
                Text(
                    text = metadata,
                    style = MaterialTheme.typography.bodySmall.copy(
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isSelected) Color.White else labelColor
                    )
                )
            }
        }
    }
}

@Composable
private fun ExplorerFooter() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Outlined.Code,
            contentDescription = null,
            modifier = Modifier.size(40.dp),
            tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f)
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "End of project files",
            style = MaterialTheme.typography.bodySmall.copy(
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)
            )
        )
    }
}

/**
 * Editor screen based on editor_kode_1/code.html design
 */
@Composable
fun CodeEditorScreen(
    onClose: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(EditorBackground)
    ) {
        EditorTopBar(onClose = onClose)
        Spacer(modifier = Modifier.height(2.dp))
        EditorContent()
        EditorAccessoryToolbar()
        EditorKeyboardPlaceholder()
    }
}

@Composable
private fun EditorTopBar(
    onClose: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surface
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onClose) {
                    Icon(
                        imageVector = Icons.Outlined.Menu,
                        contentDescription = "Menu"
                    )
                }
                Column {
                    Text(
                        text = "index.js",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Text(
                        text = "src/components/",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                    )
                }
            }

            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFEAB308))
                )
                Spacer(modifier = Modifier.width(12.dp))
                IconButton(onClick = { /* TODO: run */ }) {
                    Icon(
                        imageVector = Icons.Outlined.PlayArrow,
                        contentDescription = "Run",
                        tint = PrimaryBlue
                    )
                }
            }
        }
    }
}

@Composable
private fun EditorContent() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .weight(1f)
            .background(EditorBackground)
    ) {
        Column(
            modifier = Modifier
                .width(40.dp)
                .fillMaxHeight()
                .background(EditorGutter)
                .padding(vertical = 8.dp),
            horizontalAlignment = Alignment.End
        ) {
            (1..15).forEach { line ->
                Text(
                    text = line.toString(),
                    style = MaterialTheme.typography.bodySmall.copy(
                        fontFamily = FontFamily.Monospace,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.45f),
                        fontSize = 11.sp
                    ),
                    modifier = Modifier
                        .padding(vertical = 2.dp, horizontal = 6.dp)
                )
            }
        }

        val scrollState = rememberScrollState()

        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(EditorBackground)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(start = 8.dp, top = 8.dp, end = 8.dp, bottom = 16.dp)
                    .verticalScroll(scrollState)
            ) {
                Text(
                    text = buildCodeSnippet(),
                    style = MaterialTheme.typography.bodySmall.copy(
                        fontFamily = FontFamily.Monospace,
                        fontSize = 13.sp,
                        lineHeight = 20.sp,
                        color = Color(0xFFE5E7EB)
                    )
                )
            }

            EditorAutocompleteOverlay(
                modifier = Modifier
                    .align(Alignment.Center)
                    .padding(start = 80.dp)
            )
        }
    }
}

private fun buildCodeSnippet() = buildAnnotatedString {
    withStyle(SpanStyle(color = SyntaxKeyword)) {
        append("import")
    }
    append(" React, { useState, useEffect } ")
    withStyle(SpanStyle(color = SyntaxKeyword)) {
        append("from")
    }
    append(" ")
    withStyle(SpanStyle(color = SyntaxString)) {
        append("'react'")
    }
    append(";\n")

    withStyle(SpanStyle(color = SyntaxKeyword)) {
        append("import")
    }
    append(" { View, Text, Button } ")
    withStyle(SpanStyle(color = SyntaxKeyword)) {
        append("from")
    }
    append(" ")
    withStyle(SpanStyle(color = SyntaxString)) {
        append("'react-native'")
    }
    append(";\n\n")

    withStyle(SpanStyle(color = SyntaxComment)) {
        append("// Main Counter Component\n")
    }

    withStyle(SpanStyle(color = SyntaxKeyword)) {
        append("function")
    }
    append(" ")
    withStyle(SpanStyle(color = SyntaxFunction)) {
        append("Counter")
    }
    append("() {\n  ")
    withStyle(SpanStyle(color = SyntaxKeyword)) {
        append("const")
    }
    append(" [count, setCount] = ")
    withStyle(SpanStyle(color = SyntaxFunction)) {
        append("useState")
    }
    append("(")
    withStyle(SpanStyle(color = Color(0xFFF97316))) {
        append("0")
    }
    append(");\n\n  ")
    withStyle(SpanStyle(color = SyntaxFunction)) {
        append("useEffect")
    }
    append("(() => {\n    ")
    withStyle(SpanStyle(color = SyntaxFunction)) {
        append("console")
    }
    append(".")
    withStyle(SpanStyle(color = SyntaxFunction)) {
        append("log")
    }
    append("(")
    withStyle(SpanStyle(color = SyntaxString)) {
        append("`Current count: ${'$'}{count}`")
    }
    append(");\n  }, [count]);\n\n  ")
    withStyle(SpanStyle(color = SyntaxKeyword)) {
        append("return")
    }
    append(" (\n    <")
    withStyle(SpanStyle(color = SyntaxVariable)) {
        append("View")
    }
    append(" style={styles.container}>\n      <")
    withStyle(SpanStyle(color = SyntaxVariable)) {
        append("Text")
    }
    append(" style={styles.title}>\n        You clicked {count} times\n      </")
    withStyle(SpanStyle(color = SyntaxVariable)) {
        append("Text")
    }
    append(">\n\n      <")
    withStyle(SpanStyle(color = SyntaxVariable)) {
        append("Button")
    }
    append("\n        onPress={() => ")
    withStyle(SpanStyle(color = SyntaxFunction)) {
        append("setCount")
    }
    append("(count + 1)}\n        title=")
    withStyle(SpanStyle(color = SyntaxString)) {
        append("\"Click me\"")
    }
    append("\n      />\n    </")
    withStyle(SpanStyle(color = SyntaxVariable)) {
        append("View")
    }
    append(">\n  );\n}\n\n")
    withStyle(SpanStyle(color = SyntaxKeyword)) {
        append("export default")
    }
    append(" Counter;")
}

@Composable
private fun EditorAutocompleteOverlay(
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(MaterialTheme.colorScheme.surface)
            .padding(vertical = 8.dp)
            .width(180.dp)
    ) {
        Text(
            text = "Suggestions",
            style = MaterialTheme.typography.bodySmall.copy(
                fontWeight = FontWeight.Bold,
                fontSize = 11.sp,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            ),
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)
        )
        Spacer(modifier = Modifier.height(4.dp))
        AutocompleteItem(label = "count", isSelected = true)
        AutocompleteItem(label = "context")
        AutocompleteItem(label = "console")
    }
}

@Composable
private fun AutocompleteItem(
    label: String,
    isSelected: Boolean = false
) {
    val background = if (isSelected) PrimaryBlue.copy(alpha = 0.12f) else Color.Transparent
    val textColor = if (isSelected) PrimaryBlue else MaterialTheme.colorScheme.onSurface

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(6.dp))
            .background(background)
            .padding(horizontal = 12.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = Icons.Outlined.Code,
            contentDescription = null,
            tint = textColor,
            modifier = Modifier.size(16.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall.copy(
                fontFamily = FontFamily.Monospace,
                color = textColor
            )
        )
    }
}

@Composable
private fun EditorAccessoryToolbar() {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surface
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                ToolbarIconButton(icon = Icons.Outlined.ArrowBackIosNew, contentDescription = "Undo")
                Spacer(modifier = Modifier.width(4.dp))
                ToolbarIconButton(icon = Icons.Outlined.MoreHoriz, contentDescription = "Redo")
            }

            Spacer(modifier = Modifier.width(12.dp))

            Row(
                modifier = Modifier.weight(1f),
                horizontalArrangement = Arrangement.Center
            ) {
                EditorSymbolButton("{ }")
                EditorSymbolButton("( )")
                EditorSymbolButton("[ ]")
                EditorSymbolButton("=")
                EditorSymbolButton("\"")
                EditorSymbolButton("TAB", isPrimary = true)
            }

            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                ToolbarIconButton(icon = Icons.Outlined.Save, contentDescription = "Save")
            }
        }
    }
}

@Composable
private fun ToolbarIconButton(
    icon: ImageVector,
    contentDescription: String
) {
    Box(
        modifier = Modifier
            .size(32.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = icon,
            contentDescription = contentDescription,
            tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
        )
    }
}

@Composable
private fun EditorSymbolButton(
    label: String,
    isPrimary: Boolean = false
) {
    val background = if (isPrimary) PrimaryBlue.copy(alpha = 0.1f) else MaterialTheme.colorScheme.surfaceVariant.copy(
        alpha = 0.6f
    )
    val textColor = if (isPrimary) PrimaryBlue else MaterialTheme.colorScheme.onSurface

    Box(
        modifier = Modifier
            .padding(horizontal = 2.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(background)
            .padding(horizontal = 8.dp, vertical = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall.copy(
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Medium,
                color = textColor
            )
        )
    }
}

@Composable
private fun EditorKeyboardPlaceholder() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(220.dp)
            .background(MaterialTheme.colorScheme.background)
    ) {
        Text(
            text = "Area keyboard (placeholder)",
            style = MaterialTheme.typography.bodySmall.copy(
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)
            ),
            modifier = Modifier.align(Alignment.Center)
        )
    }
}

/**
 * Settings screen based on pengaturan_aplikasi_1/code.html design
 */
@Composable
fun SettingsScreen() {
    val scrollState = rememberScrollState()
    var fontSize by remember { mutableStateOf(14f) }
    var wordWrap by remember { mutableStateOf(true) }
    var lineNumbers by remember { mutableStateOf(true) }
    var insertSpaces by remember { mutableStateOf(false) }
    var autoSave by remember { mutableStateOf(true) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(scrollState)
    ) {
        SettingsHeader()
        Spacer(modifier = Modifier.height(8.dp))
        SettingsSearchBar()
        Spacer(modifier = Modifier.height(12.dp))

        SettingsSectionTitle("Tampilan")
        SettingsCard {
            SettingsSimpleRow(
                icon = Icons.Outlined.Code,
                iconBackground = Color(0xFFA855F7),
                title = "Tema Warna",
                subtitle = "Dracula Dark"
            )
            SettingsDivider()
            SettingsSimpleRow(
                icon = Icons.Outlined.Folder,
                iconBackground = Color(0xFFF97316),
                title = "Set Ikon File",
                subtitle = "Material Icon Theme"
            )
        }

        SettingsSectionTitle("Editor")
        SettingsCard {
            Column(
                modifier = Modifier.padding(12.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconCircle(
                            icon = Icons.Outlined.Code,
                            background = PrimaryBlue
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Ukuran Font",
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontWeight = FontWeight.Medium
                            )
                        )
                    }
                    Text(
                        text = "${fontSize.toInt()}px",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = PrimaryBlue,
                            fontWeight = FontWeight.Bold
                        )
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "A",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                    )
                    androidx.compose.material3.Slider(
                        value = fontSize,
                        onValueChange = { fontSize = it },
                        valueRange = 10f..32f,
                        modifier = Modifier
                            .weight(1f)
                            .padding(horizontal = 12.dp)
                    )
                    Text(
                        text = "A",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
                        .padding(8.dp)
                ) {
                    Text(
                        text = "function hello() { return \"World\"; }",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontFamily = FontFamily.Monospace
                        )
                    )
                }
            }

            SettingsDivider()
            SettingsSimpleRow(
                icon = Icons.Outlined.Code,
                iconBackground = Color(0xFF22C55E),
                title = "Font Family",
                subtitle = "JetBrains Mono"
            )
            SettingsDivider()
            SettingsToggleRow(
                icon = Icons.Outlined.Code,
                iconBackground = Color(0xFF6B7280),
                title = "Word Wrap",
                checked = wordWrap,
                onCheckedChange = { wordWrap = it }
            )
            SettingsDivider()
            SettingsToggleRow(
                icon = Icons.Outlined.Code,
                iconBackground = Color(0xFF6B7280),
                title = "Line Numbers",
                checked = lineNumbers,
                onCheckedChange = { lineNumbers = it }
            )
        }

        SettingsSectionTitle("Indentasi")
        SettingsCard {
            Column(
                modifier = Modifier.padding(12.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconCircle(
                        icon = Icons.Outlined.Code,
                        background = Color(0xFF6366F1)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Ukuran Tab",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            fontWeight = FontWeight.Medium
                        )
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
                        .padding(4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    SettingsSegment(text = "2", selected = false)
                    SettingsSegment(text = "4", selected = true)
                    SettingsSegment(text = "8", selected = false)
                }
            }
            SettingsDivider()
            SettingsToggleRow(
                icon = Icons.Outlined.Code,
                iconBackground = Color(0xFF6366F1),
                title = "Insert Spaces",
                checked = insertSpaces,
                onCheckedChange = { insertSpaces = it }
            )
        }

        SettingsSectionTitle("Bahasa & File")
        SettingsCard {
            SettingsSimpleRow(
                icon = Icons.Outlined.Code,
                iconBackground = Color(0xFF14B8A6),
                title = "Asosiasi File"
            )
            SettingsDivider()
            SettingsToggleRow(
                icon = Icons.Outlined.Code,
                iconBackground = Color(0xFF14B8A6),
                title = "Simpan Otomatis",
                checked = autoSave,
                onCheckedChange = { autoSave = it }
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "CodeEditor v1.0.2 (Build 240)",
                style = MaterialTheme.typography.bodySmall.copy(
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                    fontSize = 11.sp
                )
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Reset Semua Pengaturan",
                style = MaterialTheme.typography.bodySmall.copy(
                    color = Color(0xFFEF4444),
                    fontWeight = FontWeight.Medium
                )
            )
        }

        Spacer(modifier = Modifier.height(64.dp))
    }
}

@Composable
private fun SettingsHeader() {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.background
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "Kembali",
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = PrimaryBlue,
                    fontWeight = FontWeight.Medium
                )
            )
            Text(
                text = "Pengaturan",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold
                )
            )
            Text(
                text = "Selesai",
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = PrimaryBlue,
                    fontWeight = FontWeight.Bold
                )
            )
        }
    }
}

@Composable
private fun SettingsSearchBar() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(MaterialTheme.colorScheme.surface)
            .padding(horizontal = 12.dp, vertical = 8.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Outlined.Search,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Cari pengaturan (mis. Font, Tema)...",
                style = MaterialTheme.typography.bodySmall.copy(
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                )
            )
        }
    }
}

@Composable
private fun SettingsSectionTitle(title: String) {
    Text(
        text = title,
        style = MaterialTheme.typography.bodySmall.copy(
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
        ),
        modifier = Modifier
            .padding(horizontal = 20.dp)
            .padding(top = 16.dp, bottom = 6.dp)
    )
}

@Composable
private fun SettingsCard(
    content: @Composable Column.() -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(content = content)
    }
}

@Composable
private fun SettingsDivider() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(0.5.dp)
            .background(MaterialTheme.colorScheme.outline.copy(alpha = 0.4f))
    )
}

@Composable
private fun SettingsSimpleRow(
    icon: ImageVector,
    iconBackground: Color,
    title: String,
    subtitle: String? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconCircle(icon = icon, background = iconBackground)
        Spacer(modifier = Modifier.width(10.dp))
        Column {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontWeight = FontWeight.Medium
                )
            )
            if (subtitle != null) {
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                )
            }
        }
    }
}

@Composable
private fun SettingsToggleRow(
    icon: ImageVector,
    iconBackground: Color,
    title: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconCircle(icon = icon, background = iconBackground)
        Spacer(modifier = Modifier.width(10.dp))
        Text(
            text = title,
            style = MaterialTheme.typography.bodyMedium.copy(
                fontWeight = FontWeight.Medium
            ),
            modifier = Modifier.weight(1f)
        )
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange
        )
    }
}

@Composable
private fun IconCircle(
    icon: ImageVector,
    background: Color
) {
    Box(
        modifier = Modifier
            .size(32.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(background.copy(alpha = 0.2f)),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = background
        )
    }
}

@Composable
private fun SettingsSegment(
    text: String,
    selected: Boolean
) {
    val background =
        if (selected) MaterialTheme.colorScheme.background else Color.Transparent
    val textColor =
        if (selected) PrimaryBlue else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)

    Box(
        modifier = Modifier
            .weight(1f)
            .clip(RoundedCornerShape(8.dp))
            .background(background)
            .padding(vertical = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.bodySmall.copy(
                fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium,
                color = textColor
            )
        )
    }
}