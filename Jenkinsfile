pipeline {
    agent any
    tools {nodejs "node"}
    environment {
        AWS_SECRET_ACCESS_KEY = credentials("jenkins-aws-secret-access-key")
        MAP_ACCESS_KEY        = credentials("jenkins-google-maps-access-key")
        GLOBALBUS             = credentials("jenkins-globalbus-user")
        DB_HOST               = credentials("jenkins-vw-database-host")
        HOME                  = '.'
    }
    stages {
        stage('Install') {
            steps {
                sh "npm install"
            }
        }
        stage('Build') {
            steps {
                sh "GLOBALBUS_USER=$GLOBALBUS_USR"
                sh "GLOBALBUS_PASS=$GLOBALBUS_PSW"
                sh "npm run build"
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                sh 'aws s3 sync $WORKSPACE/dist/ s3://portaljal.com.br --include="*" --acl=public-read'
            }
        }
    }
}