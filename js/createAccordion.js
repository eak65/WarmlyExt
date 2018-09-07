function createAccordion(mipsDataList) {
  function createAttribute(attrName, attrValue) {
    return (typeof attrValue) === 'string' && attrValue !== '' ? `${attrName}="${attrValue}"` : '';
  }

  function createClassAttribute(className) {
    return createAttribute("class", className);
  }

  function createIdAttribute(idName) {
    return createAttribute("id", idName);
  }

  function createListItem(str, className = '', idName = '') {
    return `<li ${createClassAttribute(className)} ${createIdAttribute(idName)}>${str}</li>`;
  }

  function createOrderedList(list, className = '', idName = '') {
    var listItems = list.map(str => createListItem(str)).join('');
    return `<ul ${createClassAttribute(className)} ${createIdAttribute(idName)}>${listItems}</ul>`
  }

  function createOrderedListWithH6(list, headerText, className = '', idName = '') {
    return `${createH6(headerText)}${createOrderedList(list, className, idName)}`;
  }

  function createH6(headerText) {
    return `<h6 class="accordion-subsection-header">${headerText}</h6>`;
  }

  function createSubsection(title, content) {
    return `${createH6(title)}
                        <p>${content}</p>`;
  }

  function createSubsectionLink(title, link) {
    return `${createH6(title)}
                        <a href="link">${link}</a>`;
  }

  function createAccordionHeader(headerText) {
    return `<header class="mdlext-accordion__tab" aria-expanded="true" role="tab">
                    <span class="mdlext-accordion__tab__caption">${headerText}</span>
                    <i class="mdlext-aria-toggle-material-icons"></i>
                  </header>`;
  }
  function createAccordionTab(data) {
    var messageData = data["c"];
    var accordionHeader = createAccordionHeader(data['m']);

    var publishedSubsection = createSubsection('Published Date', messageData['published date']);
    var relevanceSubsection = createSubsection('Relevance', messageData['relevance']);
    var summarySubsection = createSubsection('Summary', messageData['summary']);
    var urlSubsection = createSubsectionLink('Url', messageData['url']);

    var keywords = createOrderedListWithH6(messageData['keywords'], 'Keywords');
    var mentions = createOrderedListWithH6(messageData['mentions'], 'Mentions');
    var quotes = createOrderedListWithH6(messageData['quotes'], 'Quotes');
    var resultDataSection = `<section class="mdlext-accordion__tabpanel" role="tabpanel" aria-hidden="false">
      ${createSubsectionDiv(publishedSubsection)}
      ${createSubsectionDiv(relevanceSubsection)}
      ${createSubsectionDiv(summarySubsection)}
      ${createSubsectionDiv(urlSubsection)}
      ${createSubsectionDiv(keywords)}
      ${createSubsectionDiv(mentions)}
      ${createSubsectionDiv(quotes)}
    </section>`;

    var accordionTabHtml = `<li class="mdlext-accordion__panel" role="presentation">
              ${accordionHeader} ${resultDataSection}</li>`;

    return accordionTabHtml;
  }

  function createSubsectionDiv(html, className = '', idName = '') {
    return `<div ${createClassAttribute(className)} ${createIdAttribute(idName)}>${html}</div>`;
  }

  var accordionTabs = [];
  var accordionLength = mipsDataList.length;
  for (var i = 0; i < accordionLength; i++) {
    accordionTabs.push(createAccordionTab(mipsDataList[i]))
  }

  return accordionTabs.join('');
}
