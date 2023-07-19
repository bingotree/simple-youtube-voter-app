var createError = require('http-errors');
const express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileio= require('fs');
var linereader = require('readline');

var app = express();


// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var raw_results_file = "./raw_results.csv";
var processed_results_file = "./results.csv";
function saveAsCSV(id, vote) {
  var csv = Date.now() + ',' + id + ',' + vote + '\n';
  try {
    fileio.appendFileSync(raw_results_file, csv);
  } catch (err) {
    console.log(err);
  }
}
async function processResults(readable) {
  var results = {};
  var firstLineFlag = true;
  for await (const chunk of readable) {
    let lines = chunk.split('\n');
    for(let i=0, max=lines.length; i<max; i++) {
      let line = lines[i];
      if(firstLineFlag || !line) { firstLineFlag = false; } else {
        let parsed = line.split(',');
        let parsed_id = parsed[1];
        let parsed_vote = parsed[2];
        if(results.hasOwnProperty(parsed_id)) {
          results[parsed_id].push(parsed_vote);
        } else {
          results[parsed_id] = [parsed_vote];
        }
      }
    }
    writeResultsToFile(results);
  }
}
function writeResultsToFile(results) {
  fileio.writeFileSync(processed_results_file, 'id,vote1,vote2,etc...\n');
  for (let key in results) {
    if (results.hasOwnProperty(key)) {
      fileio.appendFileSync(processed_results_file, key + ',' + results[key].join(',')+'\n');
    }
  }
}
module.exports = app;

var urls = [
'ygA2vHTu3h4',
'DPQuEOAvcE0',
'ltdLTcHyJc0',
'wXND6WWxZ5k',
'EtqMgFh9RYY',
'YTAh4ghH3O0',
's6zW0-X8IJU',
'Xl1dvfza2M0',
'4s33UskuwgI',
'GjpFZbvmzAo',
'sQqwKnYt5hA',
'hkGwfZIbMZs',
'F2WwjUaWJ9k',
'n76tuhCcTE8',
'sVYmpL1NMlo',
'trnfyj6_cl0',
'yCpq0nny1tw',
'6A2cPEUt6As',
'lfCTf70FDX8',
'm1TrQ9Okua0',
'Sfi4fVkONps',
'xEiZdS1HD80',
'gQXgLfBwt88',
'60S_ow-01wU',
'bhz16QzG48Y',
'Hr5ugAKA9ks',
'0Fj34gEsrnQ',
'BxPQsnKT6gg',
'eU7LC_qw1Go',
'uF-vQqNhQXk',
'5XBmyVMaKoQ',
'J7LulpNbDpk',
'zRzpct_PxiQ',
'_iI3YdeGJlQ',
'AoVqHwHOm6Y',
'hkZ_sGYEbSc',
'Gx2XAGhccc0',
'8biEhZ6OBhU',
'bFCDn7FIe2U',
'H0PSx6VgrDw',
'Npw76CUEJDU',
'4wLTS3yBpJw',
'vomYacxALd8',
'vq57jzOLXh0',
'V8f0r-q-1rc',
'ZtZ1_mx4rtk',
'cRiOJDeA814',
'DpJMfcE6vmk',
'3dcoT20u2eo',
'XFGCsV0Ff5M',
'krRG1-ggqwQ',
'OTJKgDg0pmI',
'1tvOYD8-858',
'ADjuaiUfeQE',
'0MM3EVyypn0',
'NhW2tRBdP20',
'VEqI0o_Gk1A',
'mjytivb8jWw',
'wkroxERwjsE',
'CRCeUnLI-J0',
'LL5htM_O4yw',
'YbdnbtJsyqs',
'dCd-TP0GExM',
'vT8QiHm7nvU',
'lO_bBMNe8DQ',
'IG7yYyAA0zQ',
'Yo-gPwgl5Ss',
'X_dzj2zkn4Q',
'sJGexnkMC98',
'fXkhFwk7nVw',
'I8Bxa5vla5o',
'0HW39lOedkM',
'PIUJLI9pFy0',
'RIbSkdu0BaQ',
'Re0oT0W4tg0',
'j7VpAxQpk7g',
'ap_BYPxQVX4',
'7xoViSUtkQQ',
'S0R41rZStzc',
'yzUg1Mk2xyI',
'tkhkaRCmbGI',
'81aVY3o9sBE',
'vnRhA-xDbxE',
'6q-0bJ12Rcc',
'PIUJLI9pFy0',
'RN6GQCLHpWY',
'dk_4satnG4k',
'DvGkHfBm1uI',
'-mdNcxZ5J5c',
'MQCBfZEiAJc',
'qguECNF2Olo',
'nk6nxXRpP4Y',
'BilLt3za4Sc',
'557bLPBLv2g',
'dNNh9Ebb5Mw',
'TQkJkU7yFCo',
'NjlJGAD79do',
'ylU6kh-g6qw',
'bKM4-OpUapg',
'M4H3l9EixhI',
'bxRGea8eGKc',
'6yvE6uUtTjs',
'w9kOTPVxhQI',
'c2XNeki67Vs',
'5stai7QVSnI',
'dObQiZ9OX7w',
'to67pxKpOcQ',
'FJeoJDCUlRo',
'WFr8l9ytdV4',
'tCzKGeuVwSI',
'BdHmvkbr_9Y',
'NnkfZNrkbX8',
'MCav70hTXKw',
'sQ0-q49AG78',
'OgtDdYtK4GA',
'8vEYIubzQgg',
'tp-2-mAe7Pk',
'Ys34BDEbt2Q',
'7Bd_QwgzI0U',
'28qDtZ929Hc',
'cFp-ZmwSSkQ',
'HQ-29COio18',
'7M-FRJerOQ8',
'iRZ-Xn4BVt8',
'09ZsRZAItdg',
'80NjmDAx3ms',
'GCol2e4ZZqI',
'i2H55xWgvWY',
'WdWAP0nIVvo',
'N1BV16hyJcg',
'oGlZgxbmUYY',
'pn1u4sgR9vQ',
'GMPlU0f09VU',
'PFg5NgTYlsY',
'SCYVddk_9o0',
'HtwhoQF3mu4',
'_vgQJAQ9fxA',
'rzS9V0rUaBw',
'N8BPDt4xJ_Y',
'tTalCnrlGbw',
'cqFm_H3omJE',
'6lNOkb2Jcmk',
'UNyXlFTvfiQ',
'09ZsRZAItdg',
't_IdHPfKBmc',
'zTG-sL-y_oE',
'D0LkqvWeJtQ',
'8MdgaUMx6x4',
'BpvvXeGY9uc',
'6zVY7THnqBU',
'_gOskPm68s4',
'85Nz8lvrSAY',
'vEOFs3D7c90',
'huaFMJlgmA0',
'cSNd3iA1dFk',
'vE3qW7f80Ig',
'4i1nEd2Iobg',
'S2gxR4_hehQ',
'GjpFZbvmzAo',
'zpx-JSJUM3w',
'VBVzlfoNuWo',
'eBDohJ6G8jc',
'S92CtYps_tM',
'IA0qJskOhMk',
'TNFrgNd5Xew',
'7tBSTxsSuOI',
'2kdUFlFtaRQ',
'WhWqSt5vvSE',
'-FXh2dNGLvU',
'm1DXrq2ieWA',
'66qQf0RUS98',
'R9YrV6SGlpc',
'4hWRIfAxpKA',
'bzl1X_Kyc84',
'S_dOq7quvP0',
'08EbXXJVQQU',
'ot3dcx-39M0',
'U9iFZMzxVWw',
'C9HcjDVL8CA',
'cfJMt5Q97dA',
'UwKkSMSwg7w',
'jJFbQZ860A4',
'DToxxw65qss',
'LRAq1JRxWgk',
'Lclr9JIai7Y',
'Izj3N1cEur0',
'6xgdgij2sfI',
'0pspROcqlwA',
'n26KHJu4SPk',
'z_NPWENDsy8',
'BJaSVsoUBjA',
'Msjv6ofVH8U',
'k7k6QwV8ELo',
'U6TQaCZBSvE',
'ZY9B6LtWtxk',
'-FXh2dNGLvU',
'oKVHDQLW-MA',
'uPDkn8aW3IU',
'-TO2lP0Fs9M',
'tL7ZTyzy9GI',
'BS0RSHtTY5w',
'pny3Q3Lk6hY',
'NsbY8HrkbkE',
'fcYJJaMJE9c',
'wq2gXqIboWE',
'Gx_84hIhw6E',
'HIa-wKpi2Ns',
'c8CzipMaQUg',
'MtIBgnn9RmM',
'3U_BF5zokr0',
'4d1kIYFCT7E',
'mA8kaODsGXo',
'7d9UXLZ4jl8',
'fQdThpIxtuQ',
'soUaBzSGGiY',
'ArRoXzL4O0M',
'38pV-QMkZNI',
'TJ0TNgjWQrw',
'DDP2JxNsay0',
'djMf__e4s3w',
'NAKUf50OnKM',
'sRtsNyXD9bo',
'6C3iLtu3rF8',
'RHV3VP7vZik',
'9VePeSV_FKQ',
'e9-zkvpTtWQ',
'1BzKpekzuxQ',
'7EvSfOjLvWk',
'hY_3x8tpcqs',
'vneO8UtSf6Q',
'Z3ubuNERxMw',
'qOlN49U2dNw',
'oSpozdS2zM4',
'0SJyrpwlViU',
'h70bZy1Bkrs',
'9w11SAixUA8',
'fxMZG6ouE8s',
'f3pF7tlh_SA',
'1S8Qls8mA_E',
'oMC5cU85Aj0',
'IWVPXsrFZ8U',
'nL5TSapz230',
'mtX3vs-52vE',
'n4iXSGm4gH8',
'SwGKzQB3vew',
'NrPkMvSaF80',
'FGhnyPFYiaQ',
'uWWKOVB2JeA',
'LKKpKienx5M',
'cOuncc-g2Ls',
'IRXLe96cIrc',
'EDU50Vei3Vo',
'FpcZ6sK9W8U',
'hZqCv9lKpfM',
'Z376MI1h8T8',
'scKJtwJoozU',
'd2I-jwWtpqE',
'GtFVhc6hifw',
'pR2CxfEU5-I',
'IU1R4Yy4rf0',
'rWyoiu2rwUU',
'7WUExelO8Zw',
'cwWrFnkScb4',
'eA_GCLaCpQI',
'56u2khmUlp8',
'oxE46RgCyaY',
'B_3CkYG5j-M',
'f4w5SXPBfV8',
'Z1xyq7xMBhI',
'FYauVwaG8L0',
'Qc-w7_mGK8M',
'E2Z5x0Yg9ks',
'Y8RpR6fdtH4',
'ijEXFE9mQTo',
'iiRte8nw9ig',
'schgMHrzfi8',
'wga2FeP4niU',
'CCCJ1XeGJR0',
'ivQCQtXhyLk',
'sR-7MLn_YG4',
'fmVdowYGGuw',
's7dnpU_CTBo',
'ChPWUX4_hJ0',
'wyGoEYNXOMU',
'AlIE34Q9j1o',
'W9EGExGqXXQ',
'7yzto9uP3c8',
'KXjgB-9KaAM',
'TD0Gcz3Cmfc',
'zmqLrEsSYIg',
'GC6NtxJt00Y',
'jfy36OAvJ3E',
'kF1XPnnkUQc',
'f2nH9UHudcE',
'z2afFNPwuNs',
'lBpjZOVEwPA',
'N4SFxyGxR3s',
'Q_W7vMo0SPI',
'2_DT6L0PgIU',
'5MLHT_kWzK8',
'gGOwb-Z5dq4',
'9M7W7CFNzms',
'EGshyPhSZmo',
'skdrEMcx810',
'vQ7uenor1wA',
'3UId7TwrnB8',
'P1M17G8hl1o',
'3VATh7fQQWw',
'1K7XUdu96dQ',
'KvWqHpoBJDI',
'8V5sEzLTw48',
'q5dgKpjboRQ',
'Y4ZMo9Bg9iQ',
'YcOAccvSiPM',
'yurrI9TMhTc',
'nBm-Wg6LRto',
'6sQDRBdKNSY',
'm6sKGoqVt_k',
'YCG-YXWfCps',
'SMd1N0As2hg',
'k86GIHe6KcA',
'epTI19zbw6U',
'jqs-tEnTD8M',
'EpJ21cRXRhM',
'M2c15SIn_4Y',
'U9-CFHgiVzs',
'FeZrwSVOuMk',
'U5Yt9zAfyjU',
'EHKHbuo4qlY',
'EQa2G3pggLs',
'tqFkH2N2niI',
'vKhj_O4FN9E',
'mIIUyFrg1cg',
'4613Iq6KaRk',
'lnyzUBCFSQ0',
'IY9u9gLHdZE',
'bNZv0_uIJh4',
'QYinNxIfbbQ',
'S7yzDOkjrsA',
'QYinNxIfbbQ',
'sLEmSq0YzfY',
'E6wFN9t78Yg',
'IrFtksaEl3w',
'C7Vm2t3ksbY',
'cYYvuDJtCP8',
'g_Tm9vgSpKg',
'sHU5k-V5sKA',
'Mf4Ry-MmVFo',
'NOUgND1F1Fs',
'22nRxx7iT0w',
'q4A-CosM5rk',
'pFryA-eoKjo',
'jcV_aCOLf1w',
'0_sHASMNIzw',
'_OYlMcmQ-9U',
'3wtJ9PdajkU',
'dWvP9fDZQfo',
'87Skpw5SL7o',
'yhJ_J9aj8Cs',
'KL9L2XZSTOE',
'bvjqDQzakfc',
'ohLIuTLXPq4',
'zNzlAbrWU7c',
'526F91wwfZw',
'V9xwDKCZO9g',
'VY7m6NBHEXU',
'vR4MOI7p62w',
'dNP_YdBfZW4',
'GU7C_3yVxFE',
'ZrL4NWvH4Us',
'H0PSx6VgrDw',
'h8hKsKcEagw',
'JJzDfwCJCco',
'WSv7jib1UoY',
'exFBUrWEsBI',
'48Hib8ZcUgI',
'FYnLccvor7E',
'ZNRyJ3Xc6AA',
'DpJMfcE6vmk',
'uMFaC59QjRY',
'3QAvVjAwnHc',
'Aya1RB8faLE',
'96Ratr8dvLo',
'XayIFBSoW4Q',
'D5-rXHhEfwE',
'0KUGj84GFNU',
'vEOFs3D7c90',
'BvpxSyohXIs',
'V_s7ya8IHr0',
'RoT9gRvUKTA',
'qQW21p1mtqI',
'CRg8hZNUTww',
'K7DDircnggI',
'bUixwQnXCEQ',
'H5qbH4un0Cw',
'ELz06TgWg74',
'QAB5UkjXLWg',
'odMooysJHXg',
'sZ52pKJexq0',
'zLmyxu8FItA',
'0WarKZPvT2A',
'RY351Hx46zI',
'zhXmno_sTGc',
'1W7VkuBl8A4',
'oWvOVmLAGZo',
's-Yfwb0DZNg',
'c8bjQImx9cg',
'WJXBubbMMLM',
'iiRte8nw9ig',
'0t8gsTDkNvo',
'3c4TAws0iKE',
'sdAZX__G6MU',
'VMNJMJew2mA',
'GuFaFvW2A0c',
'LrKu8ZTQQr4',
'8Ted0ZxohYk',
'AInlCnESlZ0',
'A3yVQyfWhWY',
'5ZFvWD4Ylgk',
'iOIRXp44sjw',
'N4IvvYEzSnA',
'3o8b_iGsDTI',
'jKedIt9IA2E',
'E6SPoFLZPo4',
'5yi9CmnpEKw',
'JO3Etgrdwd4',
'JTUBxH9Pyjg',
'PQh8HY0FE-E',
'l-Ig8iRHRbg',
'EfZFcQuSFc0',
'Fykhu8STaJo',
'ZfCoHMOaN88',
'oh-xeUyk5hQ',
'yyAkwvWl5Gk',
'LMW2y031rkE',
't-UJolT0qys',
'0Ky6PfExoY8',
'ORgwueAG5mY',
'RFvE1mZZs3k',
'Nixa2YUPp6o',
'jfepA8mene8',
'J_RbvPSas7o',
'ft84CtqwReI',
'Sme1m7dNJKs',
'ACvvN_Mt4Fg',
'T-kv7E8xA2s',
'nuiikTOUFug',
'DydYvdNEtS0',
'yxJ0CPskfp0',
'yvVVEjqUpAg',
'CWsC3QcP5A4',
'Y4OkI0TGYOg',
'jiLAE10-12s',
'Y6kx2kLN1Bc',
'XcO9nLJHZ9o',
'HQy-nxe72Ds',
'mi2VUKa5x-4',
'RIt4xFFJto0',
'UwVFUByLQPw',
'IteYSW1u6pI',
'xQxb46BBdXk',
'CdlpBudPnDc',
'ji0krGym04M',
'3SEk8oQdAU8',
'x9xss8nU7H8',
'53PZm5PWAlo',
'WdH-iECL4tk',
'N65Ex6Bl3Ro',
'OR8r-bqhMdw',
'wkfd10yq3Uw',
'fV6foCD5LGc',
'N3x3Qr0_5dY',
'Q5HIVoCZ7NE',
'N-fD91aUK3c',
'ysPdENXdTIY',
'kc-KV_4VOEc',
'HVbg9R1LKYg',
'08r-MrgmGIM',
'HeLB5TjNWb8',
'kDySvJxOHjg',
'Sc6BXXHHsEc',
'RN6GQCLHpWY',
'e3RlpolHfa4',
'n74ttx674pI',
'969zsF0K2aY',
'313YHO1HjuU',
'5RreSkTOq30',
'I7t5LFAHFnw',
'M1oTqYhm9Q4',
'igiMRkki4uc',
'3x-1Y2QdIqU',
'_S9Pr0bY1HE',
'LZK9OYYc-tM',
'1GlaB21IvBw',
'a0ZOkOmfIoA',
'knv8A-tdBJA',
'uhkdUZuhkeY',
'WoDyx37ucNE',
'7CYOSAhFTK0',
'woAur7VgvI8',
'jvFWq53yeiA',
'DTwgzprCCY4',
'PGN44Uxxh88',
'bNoF3VHl5dI',
'DAzAcTg1VOQ',
'nY_PG_KuyhU',
'E2KoMoZFv4c',
'BNlITGieKL0',
'IeMChWSiTOM',
'M9WbfisskyQ',
'xGe9YWV7LTE',
'JmYr5WriLzU',
'wSgTkywDG-Q',
'GAptamO4c80',
'pFryA-eoKjo',
'wcNvp4V12gU',
'wRh8MJLOF6A',
'um0DjSdWJTk',
'fLbwNYx_eAU',
'JhEJa23tDRQ',
'bkAKiqRk-j4',
'S2ADqCuQHyA',
'_BgbEhplGwk',
'dTYDmcT5Pvw',
'c1UeL7q-DcA',
'LUas8jstGgc',
'oXGFn7bN8Mc',
'XM8ObJvxMDc',
'QjjRCvxxx6E',
'cfJMt5Q97dA',
'NehdXq52ZLg',
'G_2iu50Kyik',
'gV2KLC-8dps',
'D2dvPyxtOfo',
'6t2nULdQBJ0',
'6__vz4AMQSs',
'RrvAsnj_uWY',
'VbJdb5-x9H0',
'ZGgglpujaJE',
'nx4sNfpt9Yc',
'bleuyUldr60',
'TAg0zFOJqjo',
'dEsHNzeW9Rk',
'7CYOSAhFTK0',
'sq1jgpl2bnI',
'x-xmlpyo7FE',
'hKPdnTsHiAw',
'0kP2V_PBh3w',
'KDLHkMi0hUA',
'LAellSfsySs',
'WPEW-QVgMbs',
'ty8oHCdECHI',
'syUo2x6Wyjc',
'941ofE5p0z4',
'2y2OM1qd6S0',
'TnVNJYnYgBg',
'bMOkuXNI108',
'b8A_j7tqAUY',
'eyKkKCRFkAc',
'G5K70nCGtxU',
'rNfV5uDPbwk',
'A6t71XEw-eE',
'wp8Ul9siPlE',
'0b2QUsBZE-0',
'kxkdiZvOJag',
'ijvT-tYCEj4',
'_IZrFhlsCv8',
'MThxmascVCQ',
'mHYaAmLFmjo',
'OstxUz7jhj0',
'I7W7lwtH1zs',
'2-HO8MIew8g',
'Y8d6mbdfdDY',
'IJNsQPz-sEY',
'MC0XUAXMW-E',
'02S8eXLgLsk',
'6TrEHtiHCqk',
'kfDVoUWVbFI',
'GuqPqxCNCIE',
'3fnsqZYhHiI',
'1DQYXIAfiWg',
'4lZJZ4-nnnk',
'9rhqEBHzGNM',
'-Ub2CEvKXgQ',
'iouzRKuH3dQ',
'XpIz8JQZpFc',
'z_pNGhUKz78',
'fNcuNVIkaM4',
'mbnkbb4G7uc',
'Wf92bipxUWA',
'0BAm1xrhgzY',
'LSEiwTQW0KM',
'H46VIxBopMM',
'WvnUtw4OcsU',
'Fy_86XuWcNM',
'bQXG0q0AcOM',
'DQQOQ4L9vKI',
'LDR8u9sGxfU',
'p5rktLMXxGQ',
'iQZRMJmSN9M',
'O0l4knQlvR0',
'c9qYGaIHs_I',
'UNyXlFTvfiQ',
'vvH-BvCJRc0',
'1aqHUEn1oB0',
'8iFrtzj9LaE',
'24XiekYuLT8',
'yalyJMRylUQ',
'Sign5tCDXf8',
'ZagD0lftHlo',
'oYhL2Lwt4P0',
'nGWkHDES9hY',
'VxiSlQ5NczE',
'BFi6hc3MZOM',
'EuLCQbi2mXs',
'g9UN8HAYTBg',
'6tQ42BTZq10',
'TH042kz3O4M',
'p5rktLMXxGQ',
'NO8UCGCojBE',
'Pm0W_PtrNic',
'GWZA_9EY-Gw',
'8Pj__cU_W4E',
'XcqvqRpCI6k',
'i7CAuWDM1cg',
'iXlX5oQGWC4',
'SsjlEp9Oe8Y',
'fGfvV-OZVm8',
'asemMoghazy',
'SjNVCPSE27k',
'MEN8KfYP9BQ',
'vClDUfrhFAk',
'VhRDPIxjWiw',
'c-2CV78j4pY',
'uEL5-MaIQ6E',
'gsbjVRjx9QM',
'ot3dcx-39M0',
'JXnGLnU_0Lw',
'v5JmxW6SnRE',
'ggxEeEepRBM',
'bXrINdrE1zA',
'FH7Fj8NL7XE',
'FGjPztNfDAs',
'4dNOXYgCKLs',
'2-XCQ3OuutY',
'Gkh1h0-DvSI',
'uU9NfIKWee0',
'G0aSqKdQOP8',
'15dxUoMORSM',
'fpw72Q-Ao6g',
'nd9cz_1OlLE',
'pLXEPkDKrAg',
'tEtnsoZlgek',
'qtpYUCMiDpc',
'fHCu5u0qIDs',
'LhstRI11JdM',
'hQfm1Sf8ZN0',
'2ZeqzgIJC0Q',
'uY5rQ8pMWGU',
'qGQOa_Hf1K8',
'1w_hSZcJjUI',
'y2EbRmdr6u4',
'9Xw3KI_i3XY',
'Dw4oPsKlZcA',
'YM56qXCrhG8',
'1VItmdFYU14',
'0kP2V_PBh3w',
'BKaJgz5EOhQ',
'simuI3RhyFk',
'UUuyPHRiYqw',
'0B0Wirla7Tc',
'tvvjQw3Df4Y',
'NcF_Onpo0ug',
'jJPmhXbgqpo',
'BOZOFxaHkpc',
'ctadOj54W8w',
'FTVZZhQgcH8',
'vKs0txFz1Eo',
'KvWqHpoBJDI',
'R0G2DPIrcAg',
'g5-Zrit3XFw',
'X_zPJfjcts4',
'p7km4fGDf60',
'eYH1Nw8sRZ4',
'OYz9k8qaSkE',
'Fy_nXJrl9ng',
'_FZ3B4KfFzU',
'UTYHL2PxooM',
'1gYhQ2xXxrM',
'065FETJaFaw',
'_Zsnfggc-nk',
'7n8EL1MSKTU',
'nZWZOrhkEeo',
'-Ub2CEvKXgQ',
't4Tz4l2zOWA'
];

var linkCount = urls.length;
function getRandomLink() {
  return urls[Math.floor(Math.random() * linkCount)]
}
async function processAndDownload(res) {
  const readable = fileio.createReadStream(
    raw_results_file, {encoding: 'utf8'}
  );
  await processResults(readable);
  res.download(processed_results_file);
}

app.get('/', (req, res) => {
   var randomLink = getRandomLink();
   res.render('index', {video: randomLink, bd_debug: randomLink});
});
app.get('/raw_results', (req, res) => {
  res.download(raw_results_file);
});
app.get('/process', (req, res) => {
  processResults(res);
  res.sendStatus(200);
});
app.get('/results', (req, res) => {
  processAndDownload(res);
});
/*
app.get('/clear', (req, res) => {
  fileio.writeFileSync(raw_results_file, 'timestamp,id,vote\n');
  res.sendStatus(200);
});
*/
app.put('/vote', (req, res) => {
  console.log(req.query);
  saveAsCSV(req.query.id, req.query.vote);
  res.sendStatus(200);
});
