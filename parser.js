const axios = require('axios');
const { URLSearchParams } = require('url');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('EUC-KR', 'UTF-8');
const account = require('./account');

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
const SYLlABUS_URL = 'https://info.kw.ac.kr/webnote/lecture/h_lecture.php?fsel1=00_00&fsel2=00_00&fsel4=00_00&hakgi2=hh&layout_opt=N&mode=view&prof_name=&show_hakbu=&skin_opt=&sugang_opt=all&this_year=2018';
let cookie = '';
let response;

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
  .then(() => axios.get(SYLlABUS_URL, {
    headers: {
      Cookie: cookie,
    },
    responseType: 'arraybuffer',
  }))
  .then(r => console.log(iconv.convert(r.data).toString()))

