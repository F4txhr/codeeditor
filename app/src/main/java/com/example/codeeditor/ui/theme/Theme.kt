package com.example.codeeditor.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryBlue,
    onPrimary = Color.White,
    background = BackgroundDark,
    onBackground = Color(0xFFE5E7EB),
    surface = SurfaceDark,
    onSurface = Color(0xFFE5E7EB),
    surfaceVariant = SurfaceHover,
    onSurfaceVariant = Color(0xFFC4C4CF),
    outline = BorderDark
)

@Composable
fun CodeEditorTheme(
    useDarkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colors = if (useDarkTheme) DarkColorScheme else DarkColorScheme

    MaterialTheme(
        colorScheme = colors,
        typography = CodeTypography,
        content = content
    )
}