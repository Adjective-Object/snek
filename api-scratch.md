GET /projects [
    name: 'project-name-dashes'
    description: 'description'
    packages: {
        name:
            description: 'package--description'
    },
]


GET /builds/project [
    id: 
    time: utc timestamp
    git-revision: 
    project: 'project-name-dashes' 
    package-status: {
        name: failing | succeeding | in-progress
    }
]

GET /builds/

# 
/builds/:id


