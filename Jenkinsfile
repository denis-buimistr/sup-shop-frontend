pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    environment {
        IMAGE = 'ghcr.io/denis-buimistr/sup-shop-frontend'
        EC2_HOST = '16.192.196.171'
    }

    stages {
        stage('Lint & test') {
            agent {
                docker {
                    image 'node:22-alpine'
                    reuseNode true
                }
            }
            environment {
                // у моего юзера в контейнере node нет домашней папки, кэш npm кладу во временную
                npm_config_cache = '/tmp/.npm'
            }
            steps {
                sh 'npm ci'
                sh 'npm run lint'
                sh 'npm test -- --reporter=default --reporter=junit --outputFile.junit=test-results/junit.xml'
            }
            post {
                always {
                    junit 'test-results/junit.xml'
                }
            }
        }

        stage('Build image') {
            steps {
                script {
                    env.TAG = env.GIT_COMMIT.take(7)
                }
                sh 'docker build --platform linux/arm64 -t $IMAGE:$TAG .'
            }
        }

        stage('Push image') {
            when { branch 'main' }
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-token',
                        usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
                    sh '''
                        echo "$GH_TOKEN" | docker login ghcr.io -u "$GH_USER" --password-stdin
                        docker tag $IMAGE:$TAG $IMAGE:latest
                        docker push $IMAGE:$TAG
                        docker push $IMAGE:latest
                    '''
                }
            }
            post {
                always {
                    sh 'docker logout ghcr.io'
                }
            }
        }

        stage('Deploy') {
            when { branch 'main' }
            steps {
                sshagent(credentials: ['ec2-ssh']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=accept-new ubuntu@$EC2_HOST \
                          "cd ~/sup-shop && docker compose -f docker-compose.prod.yml pull frontend \
                           && docker compose -f docker-compose.prod.yml up -d --wait frontend"
                    '''
                }
            }
        }
    }
}