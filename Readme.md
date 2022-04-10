## Install

```
npm install @bmz_1/function-pipeline
```


## Usage

```
import { Runner } from '@bmz_1/function-pipeline'

type Context = {
  foo?: string
}

const context = {}
const runner = Runner<Context>()

runner.use((context, next) => {
  context.foo = 'bar'
})


await runner.handle(context)
```