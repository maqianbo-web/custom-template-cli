#!/usr/bin/env node
// 必须在文件头添加如上内容指定运行环境为node

const { program } = require("commander"); // 解析命令和参数，用于处理用户输入的命令
const inquirer = require("inquirer"); // 交互相关
const download = require("download-git-repo"); // 远程下载
const ora = require("ora"); // 增加加载效果
const chalk = require("chalk"); // 增加文本样式
const logSymbol = require("log-symbols"); // 增加图标

const fs = require("fs");

const handleCreate = async (params, options) => {
  inquirer
    // 用户交互
    .prompt({
      type: "list",
      name: "template",
      message: "choose a template",
      choices: [
        {
          name: "vue2-js",
          value: "https://github.com/maqianbo-web/vue2-js-template.git",
        },
        {
          name: "vue2-ts",
          value: "https://github.com/maqianbo-web/vue2.0-template.git",
        },
        {
          name: "vue3-vite",
          value: "https://github.com/maqianbo-web/vue3-vite-template.git",
        },
      ],
      default: 0,
    })
    .then((answers) => {
      console.log("---------------------------");
      const { template } = answers;
      console.log("project-name", params.name);
      console.log("project-template", template);

      const spinner = ora("正在拉取模板…").start();

      download(`direct:${template}`, params.name, { clone: true }, (err) => {
        if (err) {
          spinner.fail();
          return console.log(
            logSymbol.error,
            chalk.red("下载失败，失败原因：" + err)
          );
        } else {
          spinner.succeed();
          return console.log(logSymbol.success, chalk.green("下载成功"));
        }
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

// 创建项目命令
program
  .command("create <name>[destination]")
  .description("初始化项目模板")
  .action(function (name, destination) {
    if (fs.existsSync(name)) {
      console.log(logSymbol.error, chalk.red(`已存在 ${name} 项目文件夹`));
      return;
    }
    handleCreate({ name, destination }, program.opts());
  });

// 定义create子命令，<name>为必需参数，可在action的function中接收；如果需要设置为非必需参数，可使用[]
// 命令描述说明
// 执行函数

// 利用commander解析命令行输入，必须写在所有内容最后面
program.parse(process.argv);
