# my-cli
custom fe staging

### 目的

学习本地命令行对远程项目的控制，目前只是简单的脚手架，只有单纯的初始化、拷贝模板功能。

### 参考文档

- [我想写一个前端开发工具](https://www.cnblogs.com/webARM/p/6505683.html)
- [vue-cli](https://github.com/vuejs/vue-cli)

### 分析流程

- 命令行参数获取

    在命令行中能获取的首要信息就是 process.argv, 所以要根据参数的不同进行相应的操作，那么就用到了 [commander](https://www.npmjs.com/package/commander) 的命令行接口，其中的option 接口可以捕获到命令行的参数，来进行相应的操作。
    eg:
    ```
    const program = require('commander');

    program
      .version(require('../package').version, '-v, --version')
      .usage('[options]')
      .option('-i, --init', '初始化项目文件夹')
      .parse(process.argv)

    // 如果是init则进行初始化的操作
    if (program.init) {
      require('../src/init')()
    }
    ```
- 自动化配置

    如果把所有参数都放在一行命令上，那么就太麻烦了，参数只是用作入口，具体一点的当然还是希望自己控制，那么就要支持输入、选择等可操作的功能，然后就是[inquirer](https://www.npmjs.com/package/inquirer)登场，它的作用就是提醒使用者一步一步的配置项目，比如最基础的我想给项目起一个名字，eg:
    ```
    const { project } = await inquirer.prompt([
      {
        name: 'project',
        message: 'please enter the project name',
        default: 'my-project'
      }
    ])

    console.log(project) // my-project
    ```
    可以自己输入，也会有默认的项目名称。随着前端框架、编译工具的不断增加，可选择的越来越多，这种自动化配置显得越来越重要。

- 拉取模板

    配置完成之后，要根据配置生成对应的模板，前提是会有一个基础的模板，在基础的模板上进行工具的选择，配置文件可以生成到本地保存，下来，配置项目的时候在进行读取，我这里只介绍把远程模板拉取到本地，以后或许会增加配置的node文件，由于我的模板是放在git仓库中的，所以可以使用[download-git-repo](https://www.npmjs.com/package/download-git-repo)把远程的模板拉取到本地，eg：
    ```
    const path = require('path')
    const os = require('os')
    const download = require('download-git-repo')

    const tmpdir = path.join(os.tmpdir(), 'my-cli') //获取系统临时文件存放地址，并且加上我们自己的文件名称，用于管理
    download('git项目', tmpdir, err => {
      if (err) return reject(err)
      resolve()
    })
    ```

    这里只是拉取到临时文件夹下，可以再对文件进行相应的操作，然后拷贝到自己的项目下，就完成了本地项目的构建。

### 总结

- 比较困难的就两个吧，第一个就是通过命令行获取配置文件，就是上面的步骤，第二个就是把配置文件应用到你的基础模板上，这也是暂时没有做到的，以后会慢慢实现。
