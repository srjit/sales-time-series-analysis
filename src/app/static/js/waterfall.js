async function fetchData() {
  // const data = await fetch('data.json');
    // const res = await data.json();

  const res = [
    {
        "name": "Product Revenue",
        "value": 420000
    },
    {
        "name": "Services Revenue",
        "value": 210000
    },
    {
        "name": "Fixed Costs",
        "value": -170000
    },
    {
        "name": "Variable Costs",
        "value": -140000
    }
]
  return res;
}

function dollarFormatter(n) {
  n = Math.round(n);
  var result = n;
  if (Math.abs(n) > 1000) {
    result = Math.round(n/1000) + 'K';
  }
  return '$' + result;
}

const vm = new Vue({
  el: "#app",
  data() {
    return {
      rawData: [],
      margin: {top: 20, right: 30, bottom: 30, left: 40},
      padding: 0.3,
      width: 960,
      height: 500
    }
  },
  computed: {
    widthMargin: function() {
      return this.width - this.margin.left - this.margin.right;
    },
    heightMargin: function() {
      return this.height - this.margin.top - this.margin.bottom;
    },
    transform: function() {
      return `translate(${this.margin.left},${this.margin.top})`;
    },
    transformXAxis: function() {
      return `translate(0,${this.heightMargin})`;
    },
    data: function() {
      // Transform data (i.e., finding cumulative values and total) for easier charting
      const res = JSON.parse(JSON.stringify(this.rawData));
      var cumulative = 0;
      for (var i = 0; i < res.length; i++) {
        res[i].start = cumulative;
        cumulative += res[i].value;
        res[i].end = cumulative;

        res[i].class = ( res[i].value >= 0 ) ? 'positive' : 'negative'
      }
      res.push({
        name: 'Total',
        end: cumulative,
        start: 0,
        class: 'total'
      });
      return res;
    },
    x: function() {
      const res = d3.scaleBand()
        .rangeRound([0, this.widthMargin])
        .padding(this.padding);
      res.domain(this.data.map(d => d.name));
      return res;
    },
    y: function() {
      const res = d3.scaleLinear()
        .range([this.heightMargin, 0]);
      res.domain([0, d3.max(this.data, d => d.end)]);
      return res;
    }
  },
  methods: {
    transformEl: function(el) {
      return "translate(" + this.x(el.name) + ",0)";
    },
    reactY: function(el) {
      return this.y(Math.max(el.start, el.end));
    },
    rectHeight: function(el) {
      return Math.abs(this.y(el.start) - this.y(el.end));
    },
    textY: function(el) {
      return this.y(el.end) + 5;
    },
    textDy: function(el) {
      return ((el.class === 'negative') ? '-' : '') + ".75em";
    },
    text: function(el) {
      return dollarFormatter(el.end - el.start);
    },
    lineY: function(el) {
      return this.y(el.end);
    }
  },
  async mounted() {
    const rawData = await fetchData();
    this.rawData = rawData;

    var xAxis = d3.axisBottom(this.x);
    xAxis(d3.select(".x"));

    var yAxis = d3.axisLeft(this.y).tickFormat(function(d) { return dollarFormatter(d); });
    yAxis(d3.select(".y"));
  }
});
