pipeline {
    agent any
    tools {nodejs "node"}
    environment {
        AWS            = credentials("aws-s3")
        MAP_ACCESS_KEY = credentials("jenkins-google-maps-access-key")
        GLOBALBUS      = credentials("jenkins-globalbus-user")
        DB_HOST        = credentials("jenkins-vw-database-host")
        HOME           = "."
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
                sh "AWS_ACCESS_KEY_ID=$AWS_USR"
                sh "AWS_SECRET_ACCESS_KEY=$AWS_PSW"
                sh "AWS_CONFIG_FILE=/home/ec2-user/.aws/config"
                sh "AWS_SHARED_CREDENTIALS_FILE=/home/ec2-user/.aws/credentials"
                sh "aws configure set profile jenkins"
                sh "aws configure set aws_access_key_id $AWS_USR --profile jenkins"
                sh "aws configure set aws_secret_access_key $AWS_PSW --profile jenkins"
                sh "aws configure set region us-east-1 --profile jenkins"
                sh "aws configure set output json --profile jenkins"
                sh 'aws s3 sync $WORKSPACE/dist/ s3://portaljal.com.br --include="*" --acl=public-read --profile jenkins'
            }
        }
    }
}