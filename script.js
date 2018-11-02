// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world! The primary aim of this script is to identify in what coding language the user has written the code. For v1, I only consider the first result.
// @author       Rupesh Dabbir
// @match        https://leetcode.com/contest/weekly-contest-108/ranking/*
// @grant        none
// ==/UserScript==

(function() {

    const waitFor = (...selectors) => new Promise(resolve => {
    const delay = 500
    const f = () => {
        const elements = selectors.map(selector => document.querySelector(selector))
        if (elements.every(element => element != null)) {
            resolve(elements)
        } else {
            setTimeout(f, delay)
        }
    }
    f()
    })

    waitFor('.pagination').then(([table])=>{
        $('.pagination').click(function() {
            doAjax();
        });
    });

    console.log("From TamperMonkey",$);
    waitFor('thead > tr').then(([table])=>{
        console.log(table);
        $('thead > tr').append('<th> Language</th>');
        doAjax();
    });

    function doAjax() {
        const contextSuffix = window.location.href.split('/').filter((val) => val.indexOf('weekly-contest') > -1)[0];
        const page = window.location.href.split('ranking/')[1][0] ? window.location.href.split('ranking/')[1][0]: 1;
        const url = `https://leetcode.com/contest/api/ranking/${contextSuffix}/?pagination=${page}`;
        console.log("Page is:", page);
        console.info("url is:",url);
        fetch(url)
            .then((resp) => resp.json())
            .then(function(data) {
            console.log("Results", data);
            // Data is a JSON.
            fetchSubmissionIDS(data);
       });
    }

    function fetchSubmissionIDS(data) {
      const ids = [];
      data.submissions.forEach((submission) => {
        const one = Object.values(submission)[0];
        const id = one.submission_id;
          ids.push(id);
      });
       console.log("IDS are",ids);
       fetchLanguageInfo(ids);
   }

    function fetchLanguageInfo(ids) {
      const languageArr = [];

            let url = 'https://leetcode.com/api/submissions/';


    Promise.all(ids.map(id =>
        fetch(url+id).then(resp => resp.json()).then((data) => languageArr.push(data.lang))
    )).then(data => {
        console.log("AFTER PROMISE ALL");
        appendLangToDOM(languageArr);
    })

      //console.log("Final Array with Languages", languageArr);
      //appendLangToDOM(languageArr);
    }

    function makeCallAndFetchLanguage(id, arr) {
        const url = `https://leetcode.com/api/submissions/${id}`;
        //console.info("Url to fetch Language(s):",url);
        fetch(url)
            .then((resp) => resp.json())
            .then(function(data) {
            //console.log("Language Results", data);
            // Data is a JSON.
            arr.push(Promise.resolve(data.lang));
       });
    }

    function appendLangToDOM(arr) {
        console.log("==enter==");
        console.log(arr);
        const myTd = document.createElement('td');
        myTd.innerHTML = "JS <3";
       const domNode = $('.success').append(myTd);
       const trs = Array.prototype.slice.call($('tbody > tr'));
        $('.success')
       let j=0;
       //console.log("TR's", trs);
       window.tr = trs;
       $('tbody > tr').each(function(i) {
           //console.log("Each Elem", $('tbody > tr')[i]);
           if(i > 0) {
              const td = document.createElement('td');
               //console.log("array JAKE", arr[j]);
              td.innerHTML = arr[j];
              $('tbody > tr')[i].append(td);
              j++;
           }
       });
    }


})();
