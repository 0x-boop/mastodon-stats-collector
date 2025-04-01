# Mastodon Statistics Collector

This script collects total lifetime engagement statistics from a Mastodon account, including:

- Total followers
- Total likes across all posts
- Total replies across all posts
- Total reblogs across all posts
- Average engagement metrics per post

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with the following content:

```bash
cp .env.example .env
```

3. Edit `.env` and add your Mastodon credentials:

- `MASTODON_SERVER`: Your Mastodon instance URL (e.g., https://mastodon.social)
- `MASTODON_TOKEN`: Your Mastodon access token
  - To get an access token:
    1.  Go to your Mastodon instance
    2.  Navigate to Settings > Development
    3.  Create a new application
    4.  Grant 'read' permissions
    5.  Copy the access token

## Usage

Run the script:

```bash
npm run stats
```

The script will:

1. Connect to your Mastodon account
2. Fetch ALL posts (this may take a while depending on your account size)
3. Calculate total and average engagement metrics

## Output Example

```
Starting Mastodon Statistics Collection...
Fetching account statistics...
Fetching all posts (this may take a while)...
Fetched 40 posts so far...
Fetched 80 posts so far...
Fetched 120 posts so far...
...

Total Account Statistics
=======================
Account: example
Total Followers: 1234
Total Posts Analyzed: 890

Lifetime Engagement Metrics
=========================
Total Likes: 12500
Total Reblogs: 4500
Total Replies: 3000

Average Engagement Per Post
==========================
Average Likes: 14.04
Average Reblogs: 5.06
Average Replies: 3.37
```

Note: The script fetches ALL posts from your account, so it may take several minutes to complete for accounts with many posts.
