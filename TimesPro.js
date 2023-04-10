const axios = require('axios');
const cheerio = require('cheerio');
const XLSX = require('xlsx');

const workbook = XLSX.utils.book_new();

const udemy = 'https://timespro.com/early-career/';
const courses = [
  'timespro-banking-programme-relationship-management',
  'post-graduate-diploma-in-banking-management',
  // 'javascript-basics-to-advanced',
  // 'learn-javascript-from-beginner-to-advanced',
  // 'css-javascript-certification-course-for-beginners',
  // 'the-complete-web-development-bootcamp',
  // 'python-for-data-science-and-machine-learning-bootcamp',
];

async function getCourseData(url) {
  try {
    const response = await axios.get(`${udemy}${url}/`);
    const $ = cheerio.load(response.data);
    let coursename = $('h1[data-group-value="courseTitle"]').text();
    let courseBreadcrumbItem = $('div[data-group-value="breadcrumbItem"]').text();
    let courseRating = $('div.css-1orxpag').text();
    let courseAbout = $('div#usp1').text();
    let coursePrice = $('h6[data-group-value="course-fee"]').html();
    let courseOverview = $('div.css-11hiywu').text();
    let courseCurriculum = $('div.css-8n0i04 ul li').text();
    let courseEligibilityCriteria = $('div.css-8n0i04 ul').text();
    // let courseUpdated = $('div[data-purpose="last-update-date"]').text();
    // let courseObjective = $('div[data-purpose="objective"]').text();
    // let courseDescription = $('div[data-purpose="course-description"]').text();
    // let courseRequirment = $('div.topic-menu.ud-breadcrumb').text();
    // let otherLanguage = $('div[data-purpose="caption"]').text();

    const courseInfo = {
      coursename,
      courseBreadcrumbItem,
      courseRating,
      courseAbout,
      coursePrice,
      courseOverview,
      courseCurriculum,
      courseEligibilityCriteria,
      // courseUpdated,
      // courseObjective,
      // courseDescription,
      // courseRequirment,
      // otherLanguage,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'data.xlsx');
  } catch (error) {
    console.error(error);
  }
};

scrapCourses();