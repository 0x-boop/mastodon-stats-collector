require("dotenv").config();
const { createRestAPIClient } = require("masto");

// Validate environment variables
if (!process.env.MASTODON_SERVER || !process.env.MASTODON_TOKEN) {
  console.error(
    "Error: MASTODON_SERVER and MASTODON_TOKEN environment variables are required"
  );
  process.exit(1);
}

// Initialize Mastodon client
const masto = createRestAPIClient({
  url: process.env.MASTODON_SERVER,
  accessToken: process.env.MASTODON_TOKEN,
});

async function getAllStatuses(accountId) {
  let allStatuses = [];
  let maxId = null;
  const PAGE_SIZE = 40; // Maximum allowed by Mastodon API

  while (true) {
    try {
      const params = {
        limit: PAGE_SIZE,
        excludeReblogs: true,
        excludeReplies: true,
      };

      if (maxId) {
        params.maxId = maxId;
      }

      const statuses = await masto.v1.accounts
        .$select(accountId)
        .statuses.list(params);

      if (statuses.length === 0) {
        break;
      }

      allStatuses = [...allStatuses, ...statuses];

      // Get the ID of the oldest status for pagination
      maxId = statuses[statuses.length - 1].id;

      // Log progress
      console.log(`Fetched ${allStatuses.length} posts so far...`);

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Error fetching statuses:", error.message);
      break;
    }
  }

  return allStatuses;
}

async function getAccountStats() {
  try {
    console.log("Fetching account statistics...");

    // Get the authenticated user's account
    const account = await masto.v1.accounts.verifyCredentials();

    console.log("Fetching all posts (this may take a while)...");
    const allStatuses = await getAllStatuses(account.id);

    // Calculate total engagement statistics
    const totalStats = allStatuses.reduce(
      (acc, status) => {
        return {
          favorites: acc.favorites + status.favouritesCount,
          reblogs: acc.reblogs + status.reblogsCount,
          replies: acc.replies + status.repliesCount,
        };
      },
      { favorites: 0, reblogs: 0, replies: 0 }
    );

    // Output results
    console.log("\nTotal Account Statistics");
    console.log("=======================");
    console.log(`Account: ${account.username}`);
    console.log(`Total Followers: ${account.followersCount}`);
    console.log(`Total Posts Analyzed: ${allStatuses.length}`);
    console.log("\nLifetime Engagement Metrics");
    console.log("=========================");
    console.log(`Total Likes: ${totalStats.favorites}`);
    console.log(`Total Reblogs: ${totalStats.reblogs}`);
    console.log(`Total Replies: ${totalStats.replies}`);

    // Calculate averages
    const avgStats = {
      favorites: totalStats.favorites / allStatuses.length,
      reblogs: totalStats.reblogs / allStatuses.length,
      replies: totalStats.replies / allStatuses.length,
    };

    console.log("\nAverage Engagement Per Post");
    console.log("==========================");
    console.log(`Average Likes: ${avgStats.favorites.toFixed(2)}`);
    console.log(`Average Reblogs: ${avgStats.reblogs.toFixed(2)}`);
    console.log(`Average Replies: ${avgStats.replies.toFixed(2)}`);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("API Response:", error.response.data);
    }
    process.exit(1);
  }
}

// Run the statistics collection
console.log("Starting Mastodon Statistics Collection...");
getAccountStats().catch(console.error);
