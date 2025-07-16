c to c market plaace
by kinfemichael gelaneh
To run this project on your  local machine
first
1.clone the ripo
2.instal the node modules with
```bash
npm install
```
3.setup a postgresql database with the name mela
4.create an IAM user in aws
5.create an IAM user in aws. give the user permision "putObject" for aws s3 bucket
6.create .env file in root directory of the project and assign the values for the following 

DATABASE_URL=""

JWT_SECRET="" generate the secrete with crypto js or something simmilar for a longer and more random secret key


AWS_ACCESS_KEY_ID= "" 

AWS_SECRET_ACCESS_KEY= ""

AWS_S3_REGION="" # e.g., us-east-1, eu-west-1

AWS_S3_BUCKET_NAME="" # Your S3 bucket name

NEXT_PUBLIC_BASE_URL="http://localhost:3000" # Or your production URL

7.create a migration file with 
```bash 
npx drizzle-kit generate
      or
npx drizzle-kit push #for dev

```

8.run the dev server 
```bash
npm run dev
```




Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.