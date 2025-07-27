# C2C Marketplace

**By Kinfemichael Gelaneh**

This is a Consumer-to-Consumer (C2C) marketplace application.

---



Follow these steps to set up and run the project on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js**: [Download & Install Node.js](https://nodejs.org/en/download/) (LTS version recommended)
* **PostgreSQL**: [Download & Install PostgreSQL](https://www.postgresql.org/download/)
* **AWS Account**: An active AWS account for S3 bucket integration.

### Setup Steps

1.  **Clone the Repository**

    ```bash
    git clone <your-repo-url>
    cd c2c-marketplace
    ```

2.  **Install Dependencies**

    Navigate to the project's root directory and install the required Node.js modules:

    ```bash
    npm install
    ```

3.  **Database Setup**

    Create a PostgreSQL database named `mela` in aws rds.
    set the db publicly accessible.
    download the global-bundle CA cert from aws docs and setup a ssl connection with drizle and pg.
    retrive the connection details and add them to .env file.

4.  **AWS IAM User Configuration**

    * Log in to your AWS Management Console.
    * Navigate to the IAM (Identity and Access Management) service.
    * Create a new IAM user.
    * **Grant Permissions:** Attach a policy to this user that provides `PutObject` permission for your AWS S3 bucket. You'll likely want to restrict this to a specific bucket or path. A minimal policy might look like this (replace `your-s3-bucket-name`):

        ```json
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "s3:PutObject",
                        "s3:PutObjectAcl" # Often needed for public read access if applicable
                    ],
                    "Resource": "arn:aws:s3:::your-s3-bucket-name/*"
                }
            ]
        }
        ```

5.  **Environment Variables Setup**

    Create a file named `.env.local` in the root directory of your project. Populate it with the following environment variables:

    ```env
    # Database Connection
    DATABASE_URL="postgresql://user:password@host:port/mela" # e.g., "postgresql://postgres:mysecretpassword@localhost:5432/mela"

    # JWT Secret for Authentication
    JWT_SECRET="YOUR_LONG_AND_RANDOM_JWT_SECRET_KEY_HERE" # Use a strong, randomly generated key (e.g., from a password manager or 'openssl rand -base64 32')

    # AWS S3 Configuration for Image Uploads
    AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY_ID"
    AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_ACCESS_KEY"
    AWS_S3_REGION="your-s3-bucket-region" # e.g., us-east-1, eu-west-1
    AWS_S3_BUCKET_NAME="your-s3-bucket-name"

    # Next.js Public Base URL (for API calls, if needed)
    NEXT_PUBLIC_BASE_URL="http://localhost:3000" # Use your production URL when deploying
    ```
    **Security Note:** `JWT_SECRET`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` are sensitive. Never commit your `.env.local` file to version control.

6.  **Run Database Migrations**

    Apply the database schema to your PostgreSQL database using Drizzle Kit:

    ```bash
    # For initial setup and generating new migrations
    npx drizzle-kit generate

    # To push the schema changes directly to your database (convenient for development)
    npx drizzle-kit push
    ```

7.  **Start the Development Server**

    ```bash
    npm run dev
    ```

### Access the Application

Open your web browser and navigate to:

[http://localhost:3000](http://localhost:3000)

You should now see the C2C Marketplace application running!