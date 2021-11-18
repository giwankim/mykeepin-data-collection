module.exports = {
    "extends": [
        "airbnb-base"
    ],
    "rules": {
        "no-unused-vars": ["error", { "args": "none" }],
        "no-use-before-define": ["error", { "variables": false, "functions": false, "classes": false }],
        "max-len": ["error", 150, 2, {
                "ignoreUrls": true,
                "ignoreComments": false,
                "ignoreRegExpLiterals": true,
                "ignoreTrailingComments": true,
                "ignoreStrings": true,
                "ignoreTemplateLiterals": true
            }],
        "camelcase": 0
    }
}