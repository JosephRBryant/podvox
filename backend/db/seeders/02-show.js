'use strict';

const { Show } = require('../models');

let options = {};
options.tableName = "Shows"
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Show.bulkCreate([
        {
          userId: 1,
          showTitle: 'Tech Talk Weekly',
          showSubtitle: 'Exploring the world of technology',
          showDesc: 'This podcast dives deep into the latest trends and advancements in the tech industry, offering insights and expert opinions.',
          author: 'Alice Smith',
          showLink: null,
          category: null,
          showImage: "https://toginet.com/images/podvox/tech-talk-weekly.png",
          language: 'english',
          explicit: false
        },
        {
          userId: 2,
          showTitle: 'Fitness Fanatics',
          showSubtitle: 'Your guide to a healthy lifestyle',
          showDesc: 'Fitness Fanatics is all about achieving your health goals. We discuss workouts, nutrition, and mental well-being.',
          author: 'Bob Johnson',
          showLink: null,
          category: null,
          showImage: "https://toginet.com/images/podvox/fitness-fanatic.png",
          language: 'english',
          explicit: false
        },
        {
          userId: 3,
          showTitle: 'Culinary Creations',
          showSubtitle: 'A journey through global cuisines',
          showDesc: 'Culinary Creations brings you the best recipes and food stories from around the world. A treat for all food lovers!',
          author: 'Emma Brown',
          showLink: null,
          category: null,
          showImage: "https://toginet.com/images/podvox/culinary-creations.png",
          language: 'english',
          explicit: false
        },
        {
          userId: 4,
          showTitle: 'History Uncovered',
          showSubtitle: 'Unraveling the mysteries of the past',
          showDesc: 'We dive into the intriguing world of history, revealing untold stories and fascinating facts from ancient to modern times.',
          author: 'David Lee',
          showLink: null,
          category: null,
          showImage: "https://toginet.com/images/podvox/history-uncovered.png",
          language: 'english',
          explicit: false
        },
        {
          userId: 5,
          showTitle: 'Mindful Moments',
          showSubtitle: 'Meditations and reflections for daily life',
          showDesc: 'Mindful Moments offers guided meditations and mindfulness practices to help you stay calm and centered in your daily routine.',
          author: 'Sophia White',
          showLink: null,
          category: null,
          showImage: "https://toginet.com/images/podvox/mindful-moments.png",
          language: 'english',
          explicit: false
        },
        {
          userId: 6,
          showTitle: 'Sports Central',
          showSubtitle: 'All things sports, all the time',
          showDesc: 'Your go-to podcast for the latest updates, discussions, and analysis on the world of sports.',
          author: 'Tom Black',
          showLink: null,
          category: null,
          showImage: "https://toginet.com/images/podvox/sports-central.png",
          language: 'english',
          explicit: false
        },
        {
          userId: 7,
          showTitle: 'Bookworm Chronicles',
          showSubtitle: 'Book reviews, author interviews, and more',
          showDesc: 'Bookworm Chronicles is the perfect place for book lovers. We review the latest releases and chat with authors about their work.',
          author: 'Olivia Green',
          showLink: null,
          category: null,
          showImage: "https://toginet.com/images/podvox/bookworm-chronicles.png",
          language: 'english',
          explicit: false
        },
        {
          userId: 8,
          showTitle: 'Business Insights',
          showSubtitle: 'Expert advice for entrepreneurs',
          showDesc: 'Business Insights features interviews with successful entrepreneurs, offering tips and strategies for building a thriving business.',
          author: 'Liam Clark',
          showLink: null,
          category: null,
          showImage: "https://toginet.com/images/podvox/business-insights.png",
          language: 'english',
          explicit: false
        },
        {
          userId: 9,
          showTitle: 'Pop Culture Breakdown',
          showSubtitle: 'Dissecting the world of entertainment',
          showDesc: 'From movies to music, Pop Culture Breakdown covers it all, offering in-depth analysis and commentary on the latest trends.',
          author: 'Mia Martinez',
          showLink: null,
          category: null,
          showImage: "https://toginet.com/images/podvox/pop-culture-breakdown.png",
          language: 'english',
          explicit: false
        },
        {
          userId: 10,
          showTitle: 'The Travel Diaries',
          showSubtitle: 'Adventures from around the globe',
          showDesc: 'The Travel Diaries takes you on a journey through the world’s most exciting destinations, sharing travel tips and unforgettable experiences.',
          author: 'Noah Harris',
          showLink: null,
          category: null,
          showImage: "https://toginet.com/images/podvox/the-travel-diaries.png",
          language: 'english',
          explicit: false
        }
      ], { validate: true })
    } catch(error) {
      console.error('Error during seeding shows: ', error);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Shows';
    let shows = await Show.findAll();

    return queryInterface.bulkDelete(options, {
      where: { ...shows }
    }, {})
  }
};
