module.exports = {
  'sanity test': function (browser) {
    browser
      .url('http://localhost:8080')
      .waitForElementVisible('.item-list', 2000)
      .waitForElementVisible('.news-item', 15000)
      .click('.comments-link a')
      .assert.urlContains('/item')
      .waitForElementVisible('.item-view', 15000)
      .end()
  },
  'clicking on a user redirects to  the user page': function (browser) {
    browser
      .url('http://localhost:8080')
      .waitForElementVisible('.news-item', 15000)
      .click('.by a')
      .assert.urlContains(`/user`)
      .waitForElementVisible('.user-view', 30000)
      .end()
  },
  'paginates items correctly': function (browser) {
    let originalItemListText
    browser
      .url('http://localhost:8080')
      .waitForElementVisible('.news-item', 15000)
      .getText('.item-list', function (result) {
        originalItemListText = result.value
      })
      .click('.item-list-nav a:nth-of-type(2)')
      .waitForElementNotPresent('.progress', 15000)
      .perform(() => {
        browser.expect
          .element('.item-list')
          .text.to.not.equal(originalItemListText)
      })
      .getText('.item-list', function (result) {
        originalItemListText = result.value
      })
      .click('.item-list-nav a')
      .waitForElementNotPresent('.progress', 15000)
      .perform(() => {
        browser.expect
          .element('.item-list')
          .text.to.not.equal(originalItemListText)
      })
  },
  'changes list by clicking through nav': function (browser) {
    let originalItemListText
    browser
      .url('http://localhost:8080')
      .waitForElementVisible('.news-item', 15000)
      .getText('.item-list', function (result) {
        originalItemListText = result.value
      })
      .click('.inner a:nth-of-type(2)')
      .waitForElementNotPresent('.progress', 15000)
      .perform(() => {
        browser.expect
          .element('.item-list')
          .text.to.not.equal(originalItemListText)
      })
      .getText('.item-list', function (result) {
        originalItemListText = result.value
      })
      .click('.inner a:nth-of-type(4)')
      .waitForElementNotPresent('.progress', 15000)
      .perform(() => {
        browser.expect
          .element('.item-list')
          .text.to.not.equal(originalItemListText)
      })
  }
}
