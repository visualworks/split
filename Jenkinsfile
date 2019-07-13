pipeline {
    agent any
    /*environment {
        AWS_ACCESS_KEY_ID     = credentials("jenkins-aws-secret-key-id")
        AWS_SECRET_ACCESS_KEY = credentials("jenkins-aws-secret-access-key")
        MAP_ACCESS_KEY        = credentials("jenkins-google-maps-access-key")
        GLOBALBUS_USER        = credentials("jenkins-globalbus-user")
        GLOBALBUS_PASS        = credentials("jenkins-globalbus-pass")
        DB_HOST               = credentials("jenkins-vw-database-host")
    }*/
    stages {
        stage('Build') {
            steps {
                pwd()
                sh "sudo /usr/local/bin/npm install && sudo /usr/local/bin/npm run build"
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}