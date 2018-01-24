# vue-h5-video-player(vv-player)

> 一个基于vue2.0+的video播放器组件

- 因为在npm看到的vue的video组件都不合心意（文档不全，import之后使用感觉不怎么样的），所以花了两周多的时间研究了video的api并用vue封装了一下，功能是结合了我所看过的视频控制条的功能来做的，算是比较全面了，测了很久（主要就是ie太坑）才有勇气发布出来，主题是粉色的（本人喜欢骚粉），
本来想弄播放速率的，但是只有两种浏览器支持就放弃了，后续会不断优化功能和代码，用过好用的话记得给个star！！！

npm仓库地址：https://github.com/luqihao/vue-h5-video-player

demo地址：https://luqihao.github.io/vue-h5-video-player/dist

**1. 使用方法**：

```
<template>
  <player/>
</template>

<script>
  import player from 'vv-player'
  import Vue from 'vue'
  Vue.use(player)
</script>
```

**2. 接受参数：**

| 参数名 | 描述 | 默认 |
| :-------- | --------:| --------:|
| src | 视频地址 | http://jq22com.qiniudn.com/jq22-sp.mp4 |
| width | 视频容器宽度 | 700 |
| height | 视频容器高度 | 400 |

**3. 浏览器兼容性**（因为使用了flex布局，所以ie兼容性比较差，还有监听全屏切换事件只有ie11支持）：

| 浏览器 | 兼容性|
| :-------- | --------:|
| IE | 11+ |
| Chrome | √ |
| Edge | √ |
| Firefox | √ |
| Opera | √ |
| safari | √ |
