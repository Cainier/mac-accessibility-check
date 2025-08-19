{
  "targets": [
    {
      "target_name": "access_check",
      "sources": [ "src/access_check.mm" ],
      "include_dirs": [
        "<!(node -p \"require.resolve('node-addon-api').replace(/\\/[^\\/]+$/, '')\")"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "xcode_settings": {
        "OTHER_CFLAGS": [ "-fexceptions" ],
        "MACOSX_DEPLOYMENT_TARGET": "10.15"
      },
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "conditions": [
        ["OS=='mac'", { }],
        ["OS!='mac'", {
          "sources": []
        }]
      ]
    }
  ]
}
