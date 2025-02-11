var ghpages = require('gh-pages');

ghpages.publish(
    'build',
    {
        branch: 'docs',
        silent: true,
        repo: 'https://' + process.env.GITHUB_TOKEN + '@github.com/H4ppy-04/H4ppy-04.git',
        user: {
            name: 'Joshua Rose',
            email: 'joshuarose@gmx.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)
