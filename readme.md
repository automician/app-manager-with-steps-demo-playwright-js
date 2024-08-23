# Demo of applying App Manager pattern and Steps proxy to playwright-based PageObjects

Patterns covered:

* PageObject implementation...
  * more or less standard in context of technical implementation
    * based on page locators defined in the constructor
  * where methods are considered to be a higher-level user-steps
    * hense also covering "assertion-steps" (i.e. it's not an assertion-free PageObject)
    * what makes such implementation to look more like a StepsObject than PageObject :D
  * applied to both pages and controls (like TextInput)
* An ApplicationManager as one entry point to "pages" PageObjects
  * with a corresponding playwright fixture to simplify reuse in tests
* Proxy-based wrapper around playwright test.step – to be applied on an object level to log all its methods calls (excluding `toString` and the methods named with `_` or `$` prefix)
  * allowing to report the corresponding PageObject steps
  * with actual application as `return withSteps(this)` last line in the PageObject constructor
* AAA pattern of BDD style reported steps – GIVEN/WHEN/THEN over Arrange/Act/Assert)

Find the App Manager pattern explained in [«Selenides for PageObjects Tutorial»](https://autotest.how/selenides-for-page-objects-tutorial-md).

The proxy appliction to report each step-method of a PageObject will be documented later, stay tuned;).

## Other TODOs

* fix instability of tests implementation, making failures like `Execution context was destroyed, most likely because of a navigation`
* fix: method-based locators are broken once proxied via `withSteps` if not ignored with corresponding prefix (`_` or `$`)
* add installation instructions to README
* add project settings with dotenv overrides to allow customize steps behavior (like prefixes to ignore, etc.)
* model one more page (like playwright docs, etc.)
* document main examples of code + reports in README (with screenshots, like in [python-web-test project template README](https://github.com/yashaka/python-web-test?tab=readme-ov-file#details))
* add "human readable" rendering of steps, similar to [_full_description_for helper implementation from Selene](https://github.com/yashaka/selene/blob/master/selene/common/_typing_functions.py#L119) that utilizes threading "macros" implementation in python (consider implementing similar in js)
  * in python the implementation looks like

  ```python
  thread_last(
    full_name,
    (re.sub, r'([a-z0-9])([A-Z])', r'\1 \2'),
    (re.sub, r'(\w)\.(\w)', r'\1 \2'),
    (re.sub, r'(^_+|_+$)', ''),
    (re.sub, r'_+', ' '),
    (re.sub, r'(\s)+', r'\1'),
    str.lower,
  )
  ```
* can we make proxy impl lines not reported in html report steps?
