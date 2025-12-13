package com.codeeditorx.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class WebViewActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_TITLE = "extra_title"
        const val EXTRA_ASSET_PATH = "extra_asset_path"
    }

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_webview)

        val screenTitle = intent.getStringExtra(EXTRA_TITLE) ?: "Screen"
        title = screenTitle

        webView = findViewById(R.id.editorWebView)

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true
        settings.builtInZoomControls = false
        settings.displayZoomControls = false

        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        val assetPath = intent.getStringExtra(EXTRA_ASSET_PATH)
        if (!assetPath.isNullOrEmpty()) {
            webView.loadUrl("file:///android_asset/$assetPath")
        }
    }

    override fun onBackPressed() {
        if (this::webView.isInitialized && webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}