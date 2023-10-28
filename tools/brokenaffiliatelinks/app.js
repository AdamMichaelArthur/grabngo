const prompts = require('prompts');
const Crawler = require('node-html-crawler');
const fs = require('fs');
const { http, https } = require('follow-redirects');
const axios = require('axios')

const v = require('voca');

//var domain = 'contentbounty.com'

(async () => {
		var domain = await prompts({
		            type: 'text',
		            name: 'domain',
		            message: `What Domain?`
		});

		console.log(`Crawling ${domain.domain} for broken affiliate links`)

		await startCrawl(domain.domain)

		//
})();


//return;

async function startCrawl(domain){

const crawler = new Crawler({
  domain: domain,
  timeout: 500
});

const siteTree = { pages: [], urls: {}, redirects: {} };
const getFinalStatusCodeOfRedirects = (url) => {
  if (/30\d/.test(siteTree.urls[url])) return getFinalStatusCodeOfRedirects(siteTree.redirects[url]);

  return siteTree.urls[url];
};

crawler.crawl();
crawler.on('data', (data) => {
  siteTree.urls[data.url] = data.result.statusCode;
  siteTree.pages.push({
    url: data.url,
    links: data.result.links,
  });

  process.stdout.write(`\r${crawler.countOfProcessedUrls} out of ${crawler.foundLinks.size}`);

  if (/30\d/.test(data.result.statusCode) && data.result.links[0].url) siteTree.redirects[data.url] = data.result.links[0].url;
});
crawler.on('error', (error) => console.error(error));
crawler.on('end', () => {
  const resultFilePath = `${__dirname}/${domain}.csv`;
  const resultFilePathAff = `${__dirname}/${domain}-affiliates.csv`;

  fs.writeFileSync(resultFilePath, '');
  fs.writeFileSync(resultFilePathAff, '');

  siteTree.pages.forEach((page, pageIndex) => {
    const urlOfPage = siteTree.pages[pageIndex].url;

    siteTree.pages[pageIndex].links.forEach((link, linkIndex) => {
      const urlOfLink = siteTree.pages[pageIndex].links[linkIndex].url;

      //console.log(45, urlOfLink)

      if (!urlOfLink) {
	      	if(isValidHttpUrl(siteTree.pages[pageIndex].links[linkIndex].href)){
	      	
	        const hrefOfLink = siteTree.pages[pageIndex].links[linkIndex].href;
	        const statusCodeOfLink = (/30\d/.test(siteTree.urls[urlOfLink])) ? getFinalStatusCodeOfRedirects(urlOfLink) : siteTree.urls[urlOfLink];
        	
        if (exclusions(hrefOfLink)) {
        	console.log(45, hrefOfLink)
          	fs.appendFileSync(resultFilePath, `${hrefOfLink}\r\n`);
          	if(knownAffiliateLink(hrefOfLink)){
          		fs.appendFileSync(resultFilePathAff, `${hrefOfLink}\r\n`)
          	}
      	}
        }
      }
    });
  });

  console.log(`\r\nFinish! All ${crawler.foundLinks.size} links on pages on domain ${domain} a checked!`);
  checkAffiliateLinks(resultFilePathAff);

});

var affiliateLinkPatterns = [
	"hop.clickbank.net",
	"https://shareasale.com/r.cfm",
	"amzn.to",
	"classic.avantlink.com",
	"www.linkconnector.com/ta.php",
	"www.linkconnector.com/traffic_affiliate.php",
	"www.awin1.com",
	"www.kqzyfj.com",
	"https://signup.linkshare.com/publishers/",
	"https://secure.2checkout.com/affiliate.php",
	"https://track.flexlinkspro.com/a.ashx",
	"https://www.pjatr.com/t/",
	"rstyle.me"
]

function knownAffiliateLink(url){
	for(var i = 0; i < affiliateLinkPatterns.length; i++){
		if(v.search(url, affiliateLinkPatterns[i]) != -1){
			return true;
		}
	}
	return false;
}

var brokenLinkIndicators = ["currently unavailable", "out of stock", "404"]

function brokenLinkIndicators(htmlBody){

}

const request = require('request')

var links = String(fs.readFileSync("links.txt"));

var linkAr = links.split("\r\n")

var exclude = ["facebook.com", "#comment", "mailto", "@", "instagram.com", "twitter.com", "linkedin.com", "wordpress.com"];

exclude.push(domain);

//followAllLinks(linkAr);

function exclusions(url){
	//console.log(106, url)
	for(var i = 0; i < exclude.length; i++){
		if(v.search(url, exclude[i]) != -1){
			//console.log(109, exclude[i])
			return false;
		}
	}

	return isValidHttpUrl(url);

}

function follow_next_link(link, pos){
	pos++;
	follow_link(linkAr[pos], pos)
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return string
}

function follow_link(link, pos){
	console.log(165)
	if(pos > linkAr.length){
		return
	}

	if(exclusions(link) == false){
		return follow_next_link(linkAr[pos], pos)
	}

	console.log(74, link);
	//return follow_next_link(linkAr[pos], pos)

	request.get({
			    uri: link,
			    followAllRedirects: true
			}, function (err, res, body) {

			if(err != null){
				return follow_next_link(linkAr[pos], pos)
			}

			console.log(99, "Downloaded", link);
			
			if(typeof res["request"] != 'undefined'){
				if(res["request"]["_redirect"]["redirectsFollowed"] > 0){


			console.log(171, link);
			

			console.log(180, "Orig Link", res["request"]["uri"]["href"])
			console.log(115, res.request._redirect.redirects)

			// process.exit(1);
				}
			}

			setTimeout(() => {
				follow_next_link(linkAr[pos], pos)
			}, 1500)
			
	});


}

function followAllLinks(all_links){

	if(all_links.length == 0){
		return;
	}

	follow_link(all_links[0], 0)

}

}

















async function checkAffiliateLinks(file){
	var affiliateLinks = String(fs.readFileSync(file));
	var affiliateLinksAr = affiliateLinks.split("\r\n")
	console.log(222, affiliateLinksAr)
	followAllLinks(affiliateLinksAr)
}

var exclude = ["facebook.com", "#comment", "mailto", "@", "instagram.com", "twitter.com", "linkedin.com"];


var affiliateLinkPatterns = [
	"hop.clickbank.net",
	"https://shareasale.com/r.cfm",
	"amzn.to",
	"classic.avantlink.com",
	"www.linkconnector.com/ta.php",
	"www.linkconnector.com/traffic_affiliate.php",
	"www.awin1.com",
	"www.kqzyfj.com",
	"https://signup.linkshare.com/publishers/",
	"https://secure.2checkout.com/affiliate.php",
	"https://track.flexlinkspro.com/a.ashx",
	"https://www.pjatr.com/t/",
	"rstyle.me"
]

function knownAffiliateLink(url){
	for(var i = 0; i < affiliateLinkPatterns.length; i++){
		if(v.search(url, affiliateLinkPatterns[i]) != -1){
			return true;
		}
	}
	return false;
}

var brokenLinkIndicators = ["currently unavailable", "out of stock", "404"]

function brokenLinkIndicators(htmlBody){

}

const request = require('request')

var links = String(fs.readFileSync("links.txt"));

var linkAr = links.split("\r\n")


//followAllLinks(linkAr);

function exclusions(url){
	var exclude = ["facebook.com", "#comment", "mailto", "@", "instagram.com", "twitter.com", "linkedin.com"];

	//console.log(106, url)
	for(var i = 0; i < exclude.length; i++){
		if(v.search(url, exclude[i]) != -1){
			//console.log(109, exclude[i])
			return false;
		}
	}

	return isValidHttpUrl(url);

}

function follow_next_link(link, pos, linkAr){
	pos++;
	console.log(305);

	follow_link(linkAr[pos], pos, linkAr)
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return string
}

async function follow_link(link, pos, linkAr){
	
	if(pos > linkAr.length){
		console.log(321, "All Done");
		return
	}

	if(exclusions(link) == false){
		return follow_next_link(linkAr[pos], pos)
	}

	axios.get(link)
	  .then(function (response) {

			  var str = v.lowerCase(response.data);

			  var searchResult = v.search(str, "we don't know when or if this item will be back in stock")
			  if(searchResult != -1){
			  	console.log("Found unavailable product:::", link, v.substr(str, searchResult-200, 300));
			  } else {
			  	//console.log(347, str)
			  }

		  })
		  .catch(function (error) {
		    // handle error
		    //console.log(354, error)
		  })
		  
		  .then(function () {
		    // always executed
		    //console.log(370, "Loading", linkAr[pos])
		   follow_next_link(linkAr[pos], pos, linkAr)
		  });

}

function followAllLinks(all_links){

	console.log(360)
	if(all_links.length == 0){
		return;
	}

	follow_link(all_links[0], 0, all_links)

}

//checkAffiliateLinks("honeyandbirch.com-affiliates.csv")









