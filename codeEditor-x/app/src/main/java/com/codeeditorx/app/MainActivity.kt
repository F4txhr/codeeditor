package com.codeeditorx.app

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    data class ScreenItem(
        val title: String,
        val assetFile: String
    )

    private val screens = listOf(
        ScreenItem("Editor Kode 1", "editor_kode_1.html"),
        // Tambahkan mapping lain di sini: Editor Kode 2, Terminal, Pengaturan, dll.
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val titleText: TextView = findViewById(R.id.titleText)
        titleText.text = "codeEditor-x"

        val screensContainer: LinearLayout = findViewById(R.id.screensContainer)

        screens.forEach { screen ->
            val button = Button(this).apply {
                text = screen.title
                setOnClickListener {
                    openScreen(screen)
                }
            }
            screensContainer.addView(button)
        }
    }

    private fun openScreen(screen: ScreenItem) {
        val intent = Intent(this, WebViewActivity::class.java).apply {
            putExtra(WebViewActivity.EXTRA_TITLE, screen.title)
            putExtra(WebViewActivity.EXTRA_ASSET_PATH, screen.assetFile)
        }
        startActivity(intent)
    }
}