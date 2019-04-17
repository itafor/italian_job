def agentLabel
def branchName = BRANCH_NAME
if (branchName == "staging") {
    agentLabel = "staging-node"
} else if(branchName == "master") {
    agentLabel = "prod-node"
} else {
    agentLabel = "local-slave"
}

def committer = "";
pipeline {

    agent {label agentLabel}
    stages {
        stage ('Initialize') {
            steps {
                script {
                    sh 'git log --format="%ae" | head -1 > commit-author.txt'
                    committer = readFile('commit-author.txt').trim()
                    def msg = "STARTED: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${committer}: \n${env.BUILD_URL}"
                    slackSend color: '#D4DADF', message: msg
                }
                sh 'cp /opt/environment.ts ./src/environments/environment.prod.ts'
                sh '''
                    echo "PATH = ${PATH}"
                '''
            }
        }
        stage ('Test') {
            when { anyOf { branch 'dev'; branch 'staging' } }
            steps {
               sh "npm install"
               sh "npm run e2e"
            }
        }        
        stage('Deployment') {
            when { anyOf { branch 'dev'; branch 'master'; branch 'staging' } }
            stages {
                   stage('Build & Push') {
                       steps{
                           script {
                               docker.withRegistry('https://registry.quabbly.com', 'quabbly-registry') {
                                   def customImage = docker.build("quabblyfrontend-${env.BRANCH_NAME}:${env.BUILD_ID}")
                                   customImage.push('latest')
                               }
                           }
                       }
                   }
                   stage('Start Service') {
                       environment {
                           TAG = "${env.BRANCH_NAME}"
                       }
                       steps{
                           sh "docker-compose up -d"
                       }
                   }
            }

        }



    }
    post {
        success {
            slackSend color: '#BDFFC3', message: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${committer}:\n${env.BUILD_URL}"
        }
        
        failure {
            slackSend color: '#FF9FA1', message: "FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${committer}:\n${env.BUILD_URL}"
        }

        unstable {
            slackSend color: '#FFFE89', message: "UNSTABLE: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${committer}:\n${env.BUILD_URL}"
        }
        
        
    }    
}