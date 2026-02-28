import {describe, it} from 'mocha'
import {assert} from 'chai'

import {replaceAlias} from '../src/client/editor/replace-dependency-alias'

describe('replaceDependencyAlias', () => {
  it('Updates alias in import/require statements', () => {
    const file = 'import oldalias from \'oldalias\''
    const output = replaceAlias(file, 'oldalias', 'newalias')
    const expected = 'import oldalias from \'newalias\''
    assert.equal(output, expected)
  })
  it('Handles \'import\' in alias with replace', () => {
    assert.equal(replaceAlias(
      'import \'import\'', 'import', 'newalias'
    ), 'import \'newalias\'')
  })
  it('Handles "import" in alias with replace', () => {
    assert.equal(replaceAlias(
      'import "import"', 'import', 'newalias'
    ), 'import "newalias"')
  })
  it('Only update alias in line with multiple requires', () => {
    const file = 'const require = [require(\'require\'), require(\'require\')]'
    const output = replaceAlias(file, 'require', 'newalias')
    const expected = 'const require = [require(\'newalias\'), require(\'newalias\')]'
    assert.equal(output, expected)
  })
  it('Capture group will not interrupt normal replace.', () => {
    assert.equal(replaceAlias(
      'import "import"', 'import', 'newalias'
    ), 'import "newalias"')
  })
  it('Leaves non-import occurrences of the string untouched', () => {
    const file = `import oldalias from 'oldalias' 
    // Do not touch my oldalias :) /* Do not touch here either */`
    const output = replaceAlias(file, 'oldalias', 'newalias')
    const expected = `import oldalias from 'newalias' 
    // Do not touch my oldalias :) /* Do not touch here either */`
    assert.equal(output, expected)
  })
  it('Can update multiple requires on the same line', () => {
    const file = 'const oldalias = [require(\'oldalias\'), require(\'oldalias\')]'
    const output = replaceAlias(file, 'oldalias', 'newalias')
    const expected = 'const oldalias = [require(\'newalias\'), require(\'newalias\')]'
    assert.equal(output, expected)
  })
  it('Does not change assigned variable', () => {
    const file =
    'const libs = {"oldalias": require("oldalias"), "otheralias": require("otheralias")}'
    const output = replaceAlias(file, 'oldalias', 'newalias')
    const expected =
    'const libs = {"oldalias": require("newalias"), "otheralias": require("otheralias")}'
    assert.equal(output, expected)
  })
  it('Leaves prefix-suffix imports untouched', () => {
    const file = 'require("my-oldalias")'
    const output = replaceAlias(file, 'oldalias', 'newalias')
    const expected = 'require("my-oldalias")'
    assert.equal(output, expected)
  })
  it('Handles . in alias', () => {
    assert.equal(replaceAlias(
      'import \'old.alias\'', 'old.alias', 'newalias'
    ), 'import \'newalias\'')
  })
  it('Handles . in the alias with filler character', () => {
    assert.equal(replaceAlias(
      'import \'oldxalias\'', 'old.alias', 'newalias'
    ), 'import \'oldxalias\'')
  })
  it('Handles . in alias with replace', () => {
    assert.equal(replaceAlias(
      'import \'old.alias\'', 'old.alias', 'newalias'
    ), 'import \'newalias\'')
  })
  it('Handles old.alias in alias', () => {
    assert.equal(replaceAlias(
      'require(\'oldalias\')', 'old.alias', 'newalias'
    ), 'require(\'oldalias\')')
  })
  it('Handles / in alias', () => {
    assert.equal(replaceAlias(
      'import \'old/alias\'', 'old/alias', 'newalias'
    ),
    'import \'newalias\'')
  })
  it('Invalid import (import \'old\')', () => {
    const file = 'import \'w\' from "w"'
    const output = replaceAlias(file, 'w', 'e')
    const expected = 'import \'w\' from "w"'
    assert.equal(output, expected)
  })

  it('Handles .* in alias', () => {
    assert.equal(replaceAlias(
      'require(\'x\')', '.*', 'newalias'
    ), 'require(\'x\')')
  })
  it('Handles * in alias with replace', () => {
    assert.equal(replaceAlias(
      'require(\'*\')', '*', 'newalias'
    ), 'require(\'newalias\')')
  })
  it('Handles old* in alias', () => {
    assert.equal(replaceAlias(
      'require(\'oldddd\')', 'old*', 'newalias'
    ), 'require(\'oldddd\')')
  })
  it('Handles \\d in alias', () => {
    assert.equal(replaceAlias(
      'require(\'0\')', '\\d', 'newalias'
    ), 'require(\'0\')')
  })
  it('Handles \\d in alias with replace', () => {
    assert.equal(replaceAlias(
      'require(\'\\d\')', '\\d', 'newalias'
    ), 'require(\'newalias\')')
  })
  it('Handles require in alias with replace', () => {
    assert.equal(replaceAlias(
      'require(\'require\')', 'require', 'newalias'
    ), 'require(\'newalias\')')
  })
  it('Returns expected output from various imports', () => {
    const oldAlias = 'module-name'
    const newAlias = 'hello-world'
    const fileContents = `
    import videos from 'module-name'
      import {
      something
    } from "module-name"
    import videos from 'fluffy'
      import {
      something
    } from "fluffy"

    import {
      Component
    } from 'module-name';
    import defaultMember from "module-name";
    import defaultMember from "fluffy";
    import   *    as name from "module-name";
    import   {  member }   from "module-name";
    import { member as alias } from "module-name";
    import { member1 , member2 } from "module-name";
    import { member1 , member2 as alias2 , member3 as alias3 } from "module-name";
    import defaultMember, { member, member } from "module-name";
    import defaultMember, * as name from "module-name";
    import "module-name";
    import "module-name"    // comment no problem`
    const expected = `
    import videos from 'hello-world'
      import {
      something
    } from "hello-world"
    import videos from 'fluffy'
      import {
      something
    } from "fluffy"

    import {
      Component
    } from 'hello-world';
    import defaultMember from "hello-world";
    import defaultMember from "fluffy";
    import   *    as name from "hello-world";
    import   {  member }   from "hello-world";
    import { member as alias } from "hello-world";
    import { member1 , member2 } from "hello-world";
    import { member1 , member2 as alias2 , member3 as alias3 } from "hello-world";
    import defaultMember, { member, member } from "hello-world";
    import defaultMember, * as name from "hello-world";
    import "hello-world";
    import "hello-world"    // comment no problem`
    const output = replaceAlias(fileContents, oldAlias, newAlias)
    assert.equal(output, expected)
  })

  it('Returns expected output from various require(s)', () => {
    const oldAlias = 'johnny-1.0'
    const newAlias = 'johnny-2.0'
    const fileContents = `
    require(
    'johnny-1.0'
    )
    require('johnny-1.0')
    require('johnny-1.0')
    require('johnny-1.0')
    require(  'johnny-1.0'    )
    require   (  'johnny-1.0'    ) // comments can't stop me
    require('johnny-1.0');
    require("johnny-1.0"   )
    require('
    johnny-1.1
    ')
    require('johnny-1.1'  );
    require (   "johnny-1.1"  ) \\ comments ezpz
    `
    const expected = `
    require(
    'johnny-2.0'
    )
    require('johnny-2.0')
    require('johnny-2.0')
    require('johnny-2.0')
    require(  'johnny-2.0'    )
    require   (  'johnny-2.0'    ) // comments can't stop me
    require('johnny-2.0');
    require("johnny-2.0"   )
    require('
    johnny-1.1
    ')
    require('johnny-1.1'  );
    require (   "johnny-1.1"  ) \\ comments ezpz
    `
    const output = replaceAlias(fileContents, oldAlias, newAlias)
    assert.equal(output, expected)
  })

  it('Returns expected output with combo of both imports/requires', () => {
    const oldAlias = 'johnny-1.0'
    const newAlias = 'johnny-2.0'
    const fileContents = `
    require('johnny-1.0')
    require('johnny-1.1'  );
    require (   "johnny-1.1"  ) \\ comments ezpz
    import   *    as name from "johnny-1.0";
    import   {  member }   from "johnny-1.0";
    import { member as alias } from "johnny-1.0";
    import { member1 , member2 } from "johnny-1.1";
    `
    const expected = `
    require('johnny-2.0')
    require('johnny-1.1'  );
    require (   "johnny-1.1"  ) \\ comments ezpz
    import   *    as name from "johnny-2.0";
    import   {  member }   from "johnny-2.0";
    import { member as alias } from "johnny-2.0";
    import { member1 , member2 } from "johnny-1.1";
    `
    const output = replaceAlias(fileContents, oldAlias, newAlias)
    assert.equal(output, expected)
  })
})
