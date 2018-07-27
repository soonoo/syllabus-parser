const axios = require('axios');
const { URLSearchParams } = require('url');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('EUC-KR', 'UTF-8');
const cheerio = require('cheerio');
const account = require('./account');
const upload = require('./uploader');

const data = {
  check_svc: '',
  gubun_code: 11,
  layout_opt: '',
  login_type: 2,
  p_language: 'KOREAN',
  member_no: account.id,
  password: account.pw,
};

const LOGIN_URL = 'https://info.kw.ac.kr/webnote/login/login_proc.php';
const MAIN_URL = 'http://info.kw.ac.kr';
const SESSION_URL = 'http://info2.kw.ac.kr/servlet/controller.homepage.MainServlet?p_gate=univ&p_process=main&p_page=learning&p_kwLoginType=cookie&gubun_code=11';
const SYLlABUS_URL = (year, semester) => `https://info.kw.ac.kr/webnote/lecture/h_lecture.php?fsel1=00_00&fsel2=00_00&fsel4=00_00&hakgi=${semester}&hh=&layout_opt=N&mode=view&prof_name=&show_hakbu=&skin_opt=&sugang_opt=all&this_year=${year}`;
let cookie = '';
const selector = 'body > form:nth-child(8) > table:nth-child(7) > tbody:nth-child(2) > tr:nth-child(n+2)';
let response;
let syllabusList = [];

const params = new URLSearchParams();
Object.keys(data).forEach(i => params.append(i, data[i]));

axios.post(LOGIN_URL, params)
  .then(r => {
    r.headers['set-cookie'].reduce((a, v) => cookie += v.slice(0, v.indexOf(';') + 2), cookie);

    return axios.get(MAIN_URL, {
      headers: {
        Cookie: cookie,
      },
    })
  })
  .then(() => axios.get(SESSION_URL, {
    headers: {
      Cookie: cookie,
    }
  }))
  .then(() => axios.get(SYLlABUS_URL(2018, 2), {
      headers: {
        Cookie: cookie,
      },
      responseType: 'arraybuffer',
    })
  )
  .then(r => {
    response = iconv.convert(r.data).toString();
    const $ = cheerio.load(response);

    syllabusList = [];
    $(selector).each(function(index, item) {
      const current = $(this).children();
      syllabusList.push({
        id: current.eq(0).text(),
        title: current.eq(1).text(),
        type: current.eq(3).text(),
        credit: current.eq(4).text(),
        prof: current.eq(5).text(),
      })
    });

  })
  .then(() => {
    return upload(`2018-2.json`, JSON.stringify(syllabusList));
  })
