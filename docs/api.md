# 二期图表数据结构

## 折线图(多y轴)

[![image.png](https://tuchuang001.com/images/2019/11/04/image.png)](https://tuchuang001.com/image/A1ZHO)

```js
{
        seriesData: [ 
          {
            name: "未转化", // 当前折线数据名称
            data: [ // 按照数据与xAxisData一一对应
              0,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              8,
              0,
              0,
              0,
              0,
              4,
              0,
              0,
              0,
              10,
              0,
              2,
              5,
              2,
              0
            ]
          },
          {
            name: "已转化",
            data: [
              0,
              2,
              31,
              52,
              0,
              0,
              6,
              0,
              21,
              0,
              0,
              522,
              0,
              1,
              0,
              29,
              0,
              0,
              50,
              0,
              0,
              20,
              0,
              22
            ]
          }
        ],
        xAxisData: [ // 图表x轴数据
          "00:00-01:00", // 可以换成 2019-10-29类似格式 代表日期
          "01:00-02:00",
          "02:00-03:00",
          "03:00-04:00",
          "04:00-05:00",
          "05:00-06:00",
          "06:00-07:00",
          "07:00-08:00",
          "08:00-09:00",
          "09:00-10:00",
          "10:00-11:00",
          "11:00-12:00",
          "12:00-13:00",
          "13:00-14:00",
          "14:00-15:00",
          "15:00-16:00",
          "16:00-17:00",
          "17:00-18:00",
          "18:00-19:00",
          "19:00-20:00",
          "20:00-21:00",
          "21:00-22:00",
          "22:00-23:00",
          "23:00-24:00"
        ]
      }

```

## 折线图(多x轴)日期,时段对比


![imageb8196.png](https://tuchuang001.com/images/2019/11/04/imageb8196.png)

```json
{
    "series": [
        {
            "name": "浏览量",
            "xAxisData": [ // 横坐标 如果为时段对比 要有完整的日期+时间
                "2019-10-11",
                "2019-10-12",
                "2019-10-13",
                "2019-10-14",
                "2019-10-15",
                "2019-10-16",
                "2019-10-17"
            ],
            "data": [
                820,
                932,
                901,
                934,
                1290,
                1330,
                1320
            ]
        },
        {
            "name": "浏览量",
            "xAxisData": [
                "2019-11-11",
                "2019-11-12",
                "2019-11-13",
                "2019-11-14",
                "2019-11-15",
                "2019-11-16",
                "2019-11-17"
            ],
            "data": [
                8,
                92,
                901,
                2,
                190,
                230,
                320
            ]
        }
    ]
}

```



## 地图数据

![image5ca16.png](https://tuchuang001.com/images/2019/11/04/image5ca16.png)

```json
[
    {
        "name": "北京",
        "code": 222, // 此字段用于调用其他接口,单纯显示不需要
        "value": 233
    },
    {
        "name": "黑龙江",
        "code": 223,
        "value": 192
    }
]
```

## 饼图

![image98094.png](https://tuchuang001.com/images/2019/11/04/image98094.png)

```json
{
    "legendData": [ // 图例数据 所有数据类型例如: 安卓,IOS
        "严明",
        "滕韦",
        "康祝酆",
        "米尤·倪齐",
        "尹朱",
        "禹席狄",
        "庞时安·伏周熊",
        "尤赵",
        "乐任毛",
        "尹苗董杜·任",
        "孔沈闵·张",
        "穆沈",
        "马常吴",
        "米和·蓝",
        "禹沈",
        "曹奚魏鲍水·杨",
        "沈吕戚",
        "苏黄",
        "戚阮·傅明何",
        "毕孟",
        "皮柳",
        "陶宋季",
        "强舒柏许尤·黄毛",
        "水卜张",
        "陈危",
        "谢酆邹雷·萧",
        "何周邬",
        "华陈梁",
        "傅严",
        "穆阮",
        "殷施曹",
        "毛齐和",
        "潘赵",
        "祝黄",
        "季贝",
        "臧乐·时",
        "赵何纪",
        "喻华伏路·袁秦康",
        "周邬云",
        "纪闵卞",
        "康滕",
        "金鲍",
        "孙尹贾毛·袁钱",
        "于谢傅",
        "花柏袁",
        "苏强戴",
        "祝谢梁施·曹郑",
        "卞茅·和孙常",
        "张李禹",
        "贾席汪傅贺·贾臧"
    ],
    "seriesData": [ // 数据 例如安卓用户200人 IOS500人
        {
            "name": "严明", // name字段对应legendData内容
            "value": 36615 // value 值
        },
        {
            "name": "滕韦",
            "value": 66612
        },
        {
            "name": "康祝酆",
            "value": 16298
        },
        {
            "name": "米尤·倪齐",
            "value": 67396
        },
        {
            "name": "尹朱",
            "value": 33244
        },
        {
            "name": "禹席狄",
            "value": 33766
        },
        {
            "name": "庞时安·伏周熊",
            "value": 34205
        },
        {
            "name": "尤赵",
            "value": 79770
        },
        {
            "name": "乐任毛",
            "value": 54506
        },
        {
            "name": "尹苗董杜·任",
            "value": 8832
        },
        {
            "name": "孔沈闵·张",
            "value": 14081
        },
        {
            "name": "穆沈",
            "value": 4932
        },
        {
            "name": "马常吴",
            "value": 35239
        },
        {
            "name": "米和·蓝",
            "value": 73294
        },
        {
            "name": "禹沈",
            "value": 37497
        },
        {
            "name": "曹奚魏鲍水·杨",
            "value": 72614
        },
        {
            "name": "沈吕戚",
            "value": 13798
        },
        {
            "name": "苏黄",
            "value": 58636
        },
        {
            "name": "戚阮·傅明何",
            "value": 44563
        },
        {
            "name": "毕孟",
            "value": 78579
        },
        {
            "name": "皮柳",
            "value": 11797
        },
        {
            "name": "陶宋季",
            "value": 32860
        },
        {
            "name": "强舒柏许尤·黄毛",
            "value": 80984
        },
        {
            "name": "水卜张",
            "value": 4103
        },
        {
            "name": "陈危",
            "value": 67609
        },
        {
            "name": "谢酆邹雷·萧",
            "value": 25495
        },
        {
            "name": "何周邬",
            "value": 44637
        },
        {
            "name": "华陈梁",
            "value": 9795
        },
        {
            "name": "傅严",
            "value": 76
        },
        {
            "name": "穆阮",
            "value": 12458
        },
        {
            "name": "殷施曹",
            "value": 10350
        },
        {
            "name": "毛齐和",
            "value": 14838
        },
        {
            "name": "潘赵",
            "value": 16675
        },
        {
            "name": "祝黄",
            "value": 22476
        },
        {
            "name": "季贝",
            "value": 52928
        },
        {
            "name": "臧乐·时",
            "value": 1218
        },
        {
            "name": "赵何纪",
            "value": 91114
        },
        {
            "name": "喻华伏路·袁秦康",
            "value": 35662
        },
        {
            "name": "周邬云",
            "value": 40576
        },
        {
            "name": "纪闵卞",
            "value": 69772
        },
        {
            "name": "康滕",
            "value": 84103
        },
        {
            "name": "金鲍",
            "value": 49965
        },
        {
            "name": "孙尹贾毛·袁钱",
            "value": 74139
        },
        {
            "name": "于谢傅",
            "value": 77828
        },
        {
            "name": "花柏袁",
            "value": 73563
        },
        {
            "name": "苏强戴",
            "value": 45760
        },
        {
            "name": "祝谢梁施·曹郑",
            "value": 52413
        },
        {
            "name": "卞茅·和孙常",
            "value": 64051
        },
        {
            "name": "张李禹",
            "value": 43841
        },
        {
            "name": "贾席汪傅贺·贾臧",
            "value": 51637
        }
    ]
}
```