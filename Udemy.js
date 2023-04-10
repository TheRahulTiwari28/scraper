const axios = require("axios");
const cheerio = require("cheerio");
const XLSX = require("xlsx");

const workbook = XLSX.utils.book_new();

const udemy = "https://www.udemy.com/course/";
const courses = [
  "the-complete-javascript-course",
  "full-stack-javascript",
  "javascript-basics-to-advanced",
  "learn-javascript-from-beginner-to-advanced",
  "css-javascript-certification-course-for-beginners",
  "the-complete-web-development-bootcamp",
  "python-for-data-science-and-machine-learning-bootcamp",
];

async function getCourseData(url) {
  try {
    const response = await axios.get(`${udemy}${url}/`);
    const $ = cheerio.load(response.data);
    let coursename = $('h1[data-purpose="lead-title"]').text();
    let courseHeadline = $('div[data-purpose="lead-headline"]').text();
    let courseBestseller = $(
      "div.ud-badge.ud-heading-xs.ud-badge-bestseller"
    ).text();
    let courseRating = $('span[data-purpose="rating-number"]').text();
    let courseEnrollment = $('div[data-purpose="enrollment"]').text();
    let courseCreatedBy = $(
      "a.ud-btn.ud-btn-large.ud-btn-link.ud-heading-md.ud-text-sm.ud-instructor-links > span"
    ).text();
    let courseLanguage = $('div[data-purpose="lead-course-locale"]').text();
    let courseUpdated = $('div[data-purpose="last-update-date"]').text();
    let courseObjective = $('div[data-purpose="objective"]').text();
    let courseDescription = $('div[data-purpose="course-description"]').text();
    let courseRequirment = $("div.topic-menu.ud-breadcrumb").text();
    let otherLanguage = $('div[data-purpose="caption"]').text();
    let coursePrice = $('div[data-purpose="curriculum-header"]').html();
    let courseImage = $(
      'div[data-purpose="introduction-asset"] > button > span > img'
    ).attr("src");

    console.log(courseImage);

    const courseInfo = {
      coursename,
      courseHeadline,
      courseBestseller,
      courseRating,
      courseEnrollment,
      courseCreatedBy,
      courseLanguage,
      courseUpdated,
      courseObjective,
      courseDescription,
      courseRequirment,
      otherLanguage,
      coursePrice,
      courseImage,
    };
    return courseInfo;
  } catch (error) {
    console.log(error);
  }
}

const scrapCourses = async () => {
  try {
    const coursesPromise = courses.map((course) => getCourseData(course));
    const allData = await Promise.all(coursesPromise);

    console.log(allData);

    const worksheet = XLSX.utils.json_to_sheet(allData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "data.xlsx");
  } catch (error) {
    console.error(error);
  }
};

scrapCourses();
