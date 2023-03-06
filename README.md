# test-api-soyyo

API development as test submission to access backend cargo with node

## Steps

## PART I: Download & Build on local

## Method 1: From github

### 1) Clone the repository, install node packages and verify routes locally

```
//on local
git clone https://github.com/helmer9006/api-heippi.git
cd api-heippi
npm install
npm start
```

Open your local browser and verify the test-api-soyyo is working by accessing:  
`http://localhost:4000/api/users/getAllUsers`  
`http://localhost:4000/api/users/createTypeHospitalOrPatient`  
`http://localhost:4000/api/users/createTypeDoctor`

### 2) create the docker image

cd api-heippi
docker build -t test-heippi:1 .

## 3) Create the api container

docker create -p4000:4000 --name api-heippi test-heippi:1

## 4) Execute TEST

npm test
