const config = {
	branches: ["nodejs"],
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"@semantic-release/exec",
			{
				publishCmd: "./.od-semantic-release/generate-release-tarball.sh ${nextRelease.version}",
			},
		],
		[
			"@semantic-release/github",
			{
				"assets": [
					{
						"path": [
							"**/.od-semantic-release/release.tar.gz"
						],
						"label": "release.tar.gz"
					}
				]
			}
		]
	],
};

export default config;
