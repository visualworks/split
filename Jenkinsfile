pipeline {
    agent any
    tools {nodejs "node"}
    environment {
        HOME = '.'
    }
    stages {
        stage('Install') {
            steps {
                load "/tmp/portaljal.env"
                sh "npm install"
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
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