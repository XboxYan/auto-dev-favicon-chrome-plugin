const colors = [
    '#ff9800',
    '#9c27b0',
    '#009688',
    '#f44336',
    '#3f51b5',
    '#2196f3',
    '#00bcd4',
    '#795548'
]

const default_options = [
    {
        name: 'local',
        color: colors[0],
        matches: [
            'localhost',
            '127.0.0.1'
        ]
    },
    {
        name: 'dev',
        color: colors[1],
        matches: [
            'dev*',
        ]
    },
    {
        name: 'oa',
        color: colors[2],
        matches: [
            'oa*',
        ]
    }
]