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
        ScreenItem("Editor Kode 2 - Workspace", "editor_kode_2.html"),
        ScreenItem("Manajemen Git", "manajemen_git.html"),
        ScreenItem("Integrasi CI/CD", "integrasi_ci_cd.html"),
        ScreenItem("Manajemen Bahasa", "manajemen_bahasa.html"),
        ScreenItem("Manajer Dependensi", "manajer_dependensi.html"),
        ScreenItem("Manajer Snippet Kode", "manajer_snippet_kode.html"),
        ScreenItem("Marketplace Ekstensi", "marketplace_ekstensi.html"),
        ScreenItem("Cari & Ganti Global", "cari_ganti_global_1.html"),
        ScreenItem("Pengaturan Aplikasi", "pengaturan_aplikasi_1.html"),
        ScreenItem("Penampil Log Aplikasi", "penampil_log_aplikasi.html"),
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