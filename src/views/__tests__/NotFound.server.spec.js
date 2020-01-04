/**
 * @jest-environment node
 */

import { renderToString, render } from '@vue/server-test-utils'
import NotFound from '../NotFound.vue'

describe('NotFound', () => {
  test('renders correctly on server ', async () => {
    const str = await renderToString(NotFound)
    expect(str).toMatchSnapshot()
  })
  test('renders 404 inside <h1> tag', async () => {
    const wrapper = await render(NotFound)
    expect(wrapper.find('h1').text()).toBe('404')
  })
})
