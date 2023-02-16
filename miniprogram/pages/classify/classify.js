const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    switchOldMode: false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    gridCol:3,
    vis2: app.globalData.vis,
    im0: "cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/imags/im0.png",
    im1: "cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/imags/im1.png",
    im2: "cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/imags/im2.png",
    im3: "cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/imags/im3.png",
    im4: "cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/imags/im4.png",
    im5: "cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/imags/im5.png",
    im6: "cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/imags/im6.png",
    im7: "cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/imags/im7.png",
    list: [
      {
        id:0,
        name:"新鲜水果"
      },
      {
        id:1,
        name:"海鲜水产"
      },
      {
        id:2,
        name:"精选肉类"
      },
      {
        id:3,
        name:"鲜美蔬菜"
      },
      {
        id:4,
        name:"营养蛋品"
      },
      {
        id:5,
        name:"粗粮产品"
      },
      {
        id:6,
        name:"药材菌类"
      },
      {
        id:7,
        name:"农家特产"
      }
    ],
    load: true,
    imageList1: [{
      image: 'https://pic.imgdb.cn/item/628278aa0947543129286ab8.png',
      name: '苹果'
    }, {
      image: 'https://pic.imgdb.cn/item/628278b50947543129289262.png',
      name: '香蕉'
    }, {
      image: 'https://pic.imgdb.cn/item/628278b509475431292892d3.png',
      name: '梨子'
    }, {
      image: 'https://pic.imgdb.cn/item/628278b509475431292892cc.png',
      name: '橙子'
    }, {
      image: 'https://pic.imgdb.cn/item/628278b509475431292892c3.png',
      name: '芒果'
    }, {
      image: 'https://pic.imgdb.cn/item/628278b509475431292892b7.png',
      name: '其他水果'
    }],

    imageList2: [{
      image: 'https://pic.imgdb.cn/item/6282792f09475431292a60ae.png',
      name: '鲜鱼'
    }, {
      image: 'https://pic.imgdb.cn/item/6282792f09475431292a60b7.png',
      name: '鲜虾'
    }, {
      image: 'https://pic.imgdb.cn/item/6282792f09475431292a60ef.png',
      name: '螃蟹'
    }, {
      image: 'https://pic.imgdb.cn/item/6282791d09475431292a19ea.png',
      name: '贝类'
    }, {
      image: 'https://pic.imgdb.cn/item/6282792f09475431292a60e5.png',
      name: '鱿鱼'
    }, {
      image: 'https://pic.imgdb.cn/item/6282792f09475431292a60b1.png',
      name: '海味'
    }],
    imageList3: [{
      image: 'https://pic.imgdb.cn/item/6282fc9809475431297283c7.png',
      name: '猪肉'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fcba094754312972e7cd.png',
      name: '牛肉'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fcba094754312972e7c3.png',
      name: '羊肉'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fcba094754312972e7df.png',
      name: '鸡肉'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fcba094754312972e797.png',
      name: '生肉类'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fcba094754312972e79c.png',
      name: '熟肉类'
    }],

    imageList4: [{
      image: 'https://pic.imgdb.cn/item/6282fcf70947543129739d77.png',
      name: '茄果类'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fcf70947543129739d66.png',
      name: '叶菜类'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fcf70947543129739d6d.png',
      name: '根菜类'
    }],
    
    imageList5: [{
      image: 'https://pic.imgdb.cn/item/6282fd2c09475431297444e7.png',
      name: '鲜蛋'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fd2c0947543129744501.png',
      name: '腌制蛋品'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fd2c094754312974450b.png',
      name: '蛋类制品'
    }],

    imageList6: [{
      image: 'https://pic.imgdb.cn/item/6282fd5d094754312974e9b9.png',
      name: '谷物类'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fd5d094754312974e9c2.png',
      name: '杂豆类'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fd5d094754312974e9bc.png',
      name: '块茎类'
    }],

    imageList7: [{
      image: 'https://pic.imgdb.cn/item/6282fd890947543129757156.png',
      name: '菌芝'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fd890947543129757150.png',
      name: '菇类'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fd8909475431297571a2.png',
      name: '药材'
    }],

    imageList8: [{
      image: 'https://pic.imgdb.cn/item/6282fdb8094754312975fe24.png',
      name: '地方特产'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fdb8094754312975fe1c.png',
      name: '风味卤味'
    }, {
      image: 'https://pic.imgdb.cn/item/6282fdb8094754312975fdfd.png',
      name: '美味糕饼'
    }],
  },

  onLoad() {
    this.setData({
      tabbarHeight: app.globalData.tabbarHeight,
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    
  },
  onReady() {
    wx.hideLoading()
  },

  onShow() {
    this.tabBar();
    this.setData({
      switchOldMode: app.globalData.switchOldMode
    })
  },

  tabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },

  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;     
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },

  toFruit(e) {
    var idx = e.currentTarget.dataset.index;
    var tag = this.data.imageList1[idx].name;
    // console.log(tag)
    wx.navigateTo({
      url: '../../pages/detailed/detailed?tag=' + tag
    })
  },

  toSeaFood(e) {
    var idx = e.currentTarget.dataset.index;
    var tag = this.data.imageList2[idx].name;
    // console.log(tag)
    wx.navigateTo({
      url: '../../pages/detailed/detailed?tag=' + tag
    })
  },

  toMeat(e) {
    var idx = e.currentTarget.dataset.index;
    var tag = this.data.imageList3[idx].name;
    wx.navigateTo({
      url: '../../pages/detailed/detailed?tag=' + tag
    })
  },

  toVegetable(e) {
    var idx = e.currentTarget.dataset.index;
    var tag = this.data.imageList4[idx].name;
    // console.log(tag)
    wx.navigateTo({
      url: '../../pages/detailed/detailed?tag=' + tag
    })
  },

  toEgg(e) {
    var idx = e.currentTarget.dataset.index;
    var tag = this.data.imageList5[idx].name;
    // console.log(tag)
    wx.navigateTo({
      url: '../../pages/detailed/detailed?tag=' + tag
    })
  },

  toBeans(e) {
    var idx = e.currentTarget.dataset.index;
    var tag = this.data.imageList6[idx].name;
    // console.log(tag)
    wx.navigateTo({
      url: '../../pages/detailed/detailed?tag=' + tag
    })
  },

  toMedicine(e) {
    var idx = e.currentTarget.dataset.index;
    var tag = this.data.imageList7[idx].name;
    // console.log(tag)
    wx.navigateTo({
      url: '../../pages/detailed/detailed?tag=' + tag
    })
  },

  toSpecialty(e) {
    var idx = e.currentTarget.dataset.index;
    var tag = this.data.imageList8[idx].name;
    // console.log(tag)
    wx.navigateTo({
      url: '../../pages/detailed/detailed?tag=' + tag
    })
  },

  Search: function(e) {
    wx.navigateTo({
      url: '../../pages/homesearch/homesearch',
    })
  }



})