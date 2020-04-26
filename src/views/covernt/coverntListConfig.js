export const stayTimeConfig = [
  {
    name: "停留时长",
    value: null
  },
  {
    name: "0s~2s",
    value: {
      min: 0,
      max: 2
    }
  },
  {
    name: "2s~4s",
    value: {
      min: 2,
      max: 4
    }
  },
  {
    name: "4s~8s",
    value: {
      min: 4,
      max: 8
    }
  },
  {
    name: "8s~12s",
    value: {
      min: 8,
      max: 12
    }
  },
  {
    name: "12s~20s",
    value: {
      min: 12,
      max: 20
    }
  },
  {
    name: "15s~20s",
    value: {
      min: 15,
      max: 20
    }
  },
  {
    name: "20s~30s",
    value: {
      min: 20,
      max: 30
    }
  },
  {
    name: "30s~40s",
    value: {
      min: 30,
      max: 40
    }
  },
  {
    name: "40s~50s",
    value: {
      min: 40,
      max: 50
    }
  },
  {
    name: "50s~60s",
    value: {
      min: 50,
      max: 60
    }
  },
  {
    name: "1min~2min",
    value: {
      min: 1 * 60,
      max: 2 * 60
    }
  },
  {
    name: "2min~10min",
    value: {
      min: 2 * 60,
      max: 10 * 60
    }
  },
  {
    name: "10min~15min",
    value: {
      min: 10 * 60,
      max: 15 * 60
    }
  },
  {
    name: "15min~30min",
    value: {
      min: 15 * 60,
      max: 30 * 60
    }
  },
  {
    name: "30min以上",
    value: {
      min: 30
    }
  }
];
const arr = new Array(10).fill(0).map((item, index) => {
  const rIndex = index * 10;
  return {
    name: `${rIndex}%~${rIndex + 10}%`,
    value: {
      min: rIndex,
      max: rIndex + 10
    }
  };
});
arr.unshift({
  name: "访问深度",
  value: null
});

export const depthConfigList = [...arr];
