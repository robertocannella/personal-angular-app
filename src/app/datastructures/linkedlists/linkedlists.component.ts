import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';
import * as d3Transform from 'd3';
import { LinkedList, LLNode } from './LinkedList';


@Component({
  selector: 'app-linkedlists',
  templateUrl: './linkedlists.component.html',
  styleUrls: ['./linkedlists.component.sass']
})
export class LinkedlistsComponent implements OnInit {
  title: string = 'Linked Lists';
  dataset: LLNode[] = [];

  // SVG Components
  width = 700;
  height = 250;
  vbWidth = 400;
  vbHeight = 150;
  xmlns = 'http://www.w3.org/2000/svg';
  svgId = 'link-list-nodes';

  // D3 Components
  d3zoom: any = d3.zoom().scaleExtent([.4, 1.1]);
  panX: number = 0;
  panY: number = 0;
  panScale: number = 1;
  canvas: any;
  nodes: any;
  xScale: any;
  hScale: any;
  yScale: any;
  buttons: boolean = true;
  linkedList: LinkedList = new LinkedList()
  currentValues: any[] = [];
  _buttons: boolean = true;
  constructor() { }

  ngOnInit(): void {
    this.buildSVG();


  }
  buildSVG() {
    this.xScale = d3.scaleLinear()
      .domain([0, 15])
      .range([0, this.width + 100])
    this.hScale = d3.scaleLinear()
      .domain([0, 110])
      .range([0, this.height])
    this.yScale = d3.scaleLinear()
      .domain([0, 80])
      .range([this.height, 0])


    this.canvas = d3.select('#svg-linked-lists')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `-100 100 ${this.vbWidth} ${this.vbHeight}`)
      .attr('id', this.svgId)
      .attr('xmlns', this.xmlns)
      .call(this.d3zoom
        .on("zoom", (event: any) => this.zoom(event))
        .on('end', (event: any) => {
          if (event.transform !== d3.zoomIdentity) {
            let vectorPan: any = event.transform
            this.panX = vectorPan.x;
            this.panY = vectorPan.y;
            this.panScale = vectorPan.k;

          }
        })
      )

    this.canvas
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', 10)
      .attr('markerHeight', 7)
      .attr('refX', 0)
      .attr('refY', 3.5)
      .append('polygon')
      .attr('points', `0 0, 10 3.5, 0 7`)
    this.setupCanvas(4); // how many elements to start with?
    this.updateSVG();
    //this.canvas.transition().call(this.d3zoom.translateBy, -100, 0)
    //this.canvas.transition().call(this.d3zoom.scaleBy, 0.9);
    let x: any = document.getElementById('svg-linked-lists')

    x.scrollTo({
      top: 0,
      left: (this.vbWidth / 5.5),
      behavior: 'smooth'
    })
  }
  async setupCanvas(n: number) {
    // build linked list
    for (let i = 0; i < n; i++)
      await this.addLast();

  }
  async removeAt(value: any) {
    this.toggleButtons();
    await this.showRemoveAt(value).then(() => {

      this.linkedList.removeValue(parseInt(value));
      this.dataset = this.linkedList.toLLNodeArray();
      this.currentValues = this.linkedList.toArray();
      //this.updateSVG();
      //remove existing elements to clear old animation
      d3.select('#link-list-nodes').selectAll('g').remove();

    })


    this.toggleButtons();
    // call twice to reset next/null labeling
    this.updateSVG();
    this.updateSVG();

  }
  async addLast() { // add
    let newNodeValue = Math.floor(Math.random() * 50)
    this.currentValues = this.linkedList.toArray();

    while (this.currentValues.includes(newNodeValue))
      newNodeValue = Math.floor(Math.random() * 50)

    this.linkedList.addLast(newNodeValue)
    this.dataset = this.linkedList.toLLNodeArray()
    this.toggleButtons();
    await this.showAddLast();

    this.toggleButtons();
    this.updateSVG();

  }
  async deleteLast() { // remove
    if (!this.linkedList.isEmpty()) {
      this.linkedList.deleteLast();
      this.dataset = this.linkedList.toLLNodeArray()

      this.updateSVG();
    }
  }
  btnfunc3() { //randomize
    this.displayLinks(200);
    // for (var i = 0; i < this.dataset.length; i++) {
    //   this.dataset[i].value = Math.floor(Math.random() * 50);
    // }
    // this.updateSVG();
  }
  updateSVG() {
    let defaultDuration = 200;
    this.generateSVG();
    this.displayLinks(defaultDuration);
  }
  async generateSVG() {

    let defaultDuration = 200;
    d3.selectAll('#show-add-last')
      .transition()
      .duration(1000)
      .delay(100)
      .attr('opacity', 0)
      .remove()

    d3.select('#link-list-nodes')
      .selectAll('g')
      .data(this.dataset)
      .join(
        (enter) => {
          return enter
            .append('g')
            .attr('class', 'll-group')
            .each(async (d: LLNode, i: any, nodes: any) => {


              d3.select(nodes[i]).append('rect')
                .attr('width', 40)
                .attr('height', 40)
                .attr('id', (d: any, i: any) => 'rect' + d.value)
                .attr('y', 150)
                .attr('x', () => this.xScale(i.toString()))
                .attr('fill', 'orange')
                .attr('stroke-width', 1)
                .attr('stroke', 'black')
                .attr('stroke-opacity', 1)
                .attr('opacity', .75)
                .attr('transform', `translate(${this.panX},${this.panY}) scale(${this.panScale}, ${this.panScale})`)
                .transition()
                .duration(defaultDuration)




              // Placeholder for value
              d3.select(nodes[i]).append('text')
                .text((d: any) => d.value)
                .attr('alignment-baseline', 'central')
                .attr('text-anchor', 'middle')
                .attr('class', 'element-value')
                .attr('id', (d: any, i: any) => 'text' + d.value)
                .attr('x', (d: any, index: any) => this.xScale(i.toString()) + 20)
                .attr('y', 175)
                .attr('opacity', .75)
                .attr('transform', `translate(${this.panX},${this.panY}) scale(${this.panScale}, ${this.panScale})`)
                .transition()
                .duration(defaultDuration)

              // Placeholder for Next

              d3.select(nodes[i]).append('text')
                .text('null')
                .attr('id', (d: any) => 'next-placeholder' + d.value)
                .attr('alignment-baseline', 'central')
                .attr('text-anchor', 'middle')
                .attr('class', 'next-placeholder')
                .attr('x', (d: any, index: any) => this.xScale(i.toString()) + 20)
                .attr('y', 156)
                .attr('font-size', ".70em")
                .attr('opacity', .75)
                .attr('transform', `translate(${this.panX},${this.panY}) scale(${this.panScale}, ${this.panScale})`)
                .transition()
                .duration(defaultDuration)
                .delay(200)

            })

        },
        (update) => {
          return update
            .each((d: any, i: any, nodes: any) => {
              d3.select(nodes[i]).selectAll('rect')
                .attr('id', (d: any, i: any) => 'rect' + d.value)
                .attr('x', (d: any, index: any) => this.xScale(i.toString()))

              d3.select(nodes[i]).selectAll(`#text${d.value}`)
                .attr('id', (d: any, i: any) => 'text' + d.value)
                .text((d: any) => d.value)

              d3.select(nodes[i]).selectAll(`.next-placeholder`)
                .text(() => {
                  if (i === 0)
                    return 'head'
                  else
                    return d.next === null ? 'null' : 'next'
                })
            })
        },
        (exit) => {
          return exit
            .each((d: LLNode, i: any, nodes: any) => {
              let shapes = ['rect', 'circle', 'text']
              shapes.forEach(element => {
                d3.select(nodes[i]).selectAll(element)
                  .transition()
                  .duration(defaultDuration)
                  .attr('opacity', 0)
                  .remove();
              });
            })
            .transition()
            .duration(defaultDuration)
            .remove();
        }
      )
      .attr('id', (d: any) => 'group' + d.value)
      .attr('cursor', 'pointer')
      .each((d: LLNode, i: any, nodes: any) => {
        let shapes = ['rect', 'circle', 'text', 'line']
        shapes.forEach(element => {
          d3.select(nodes[i]).selectAll(element)
            .on('click', (event) => {
              console.log(`Node: ${d.value}`, d)
              console.log(event)
            })
            .transition()
            .duration(defaultDuration)
            .attr('opacity', .75)
        });
      })
    this.displayLinks(defaultDuration);
  }

  showRemoveAt(value: string) {
    let index = this.linkedList.indexOf(parseInt(value));
    let currentSVG = d3.select('#link-list-nodes');
    let currentElement = currentSVG
      .selectAll('.ll-group').filter((d: any, i: any, n: any) => {
        return i == index;
      });

    if (this.linkedList.hasSingleItem()) {
      return Promise.all([
        currentElement.transition().duration(1000).delay(299).attr('opacity', 0).remove().end()
      ])
    }

    let remainingElements = currentSVG
      .selectAll('.ll-group').filter((d: any, i: any, n: any) => {
        return i > index;
      })

    // see details below for shifting nodes 
    let xDifference = 0;
    let yDifference = 0;

    currentSVG.selectAll('.ll-group').selectAll('rect').call((nodes: any) => {
      let aX = parseInt(d3.select(nodes.nodes()[0]).attr('x'))
      let bX = parseInt(d3.select(nodes.nodes()[1]).attr('x'))
      let aY = parseInt(d3.select(nodes.nodes()[0]).attr('y'))
      let bY = parseInt(d3.select(nodes.nodes()[1]).attr('y'))
      xDifference = aX - bX;
      yDifference = aY - bY;
    })

    return Promise.all([

      currentSVG
        .append('circle')
        .attr('r', 5)
        .attr('id', 'show-remove-at')
        .attr('cy', 140)
        .attr('cx', 0)
        .attr('opacity', .90)
        .attr('fill', 'cornflowerblue')
        .attr('stroke-width', 0)
        .attr('stroke', 'black')
        .attr('transform', `translate(${this.panX},${this.panY}) scale(${this.panScale}, ${this.panScale})`)
        .transition()
        .duration(index * 100)
        .delay(0)
        .attr('cx', (d: any, i: any) => this.xScale(index.toString()) + 20)
        .on('end', (d: any, i: any, nodes: any) => {
          d3.select(nodes[i])
            .transition()
            .duration(300)
            .delay(0)
            .attr('opacity', 0)
            .remove()

        })
        .end(),

      currentSVG
        .select(`#line${this.dataset[index].value}`).transition().duration(300).delay(index * 100).attr('opacity', 0).remove().end(),
      currentSVG
        .select(`#line${this.dataset[index].next?.value}`).transition().duration(300).delay(index * 100).attr('opacity', 0).remove().end(),
      currentSVG
        .select(`#rect${this.dataset[index].value}`).transition().duration(300).delay(index * 100).attr('opacity', 0).remove().end(),
      currentSVG
        .select(`#text${this.dataset[index].value}`).transition().duration(300).delay(index * 100).attr('opacity', 0).remove().end(),
      currentSVG
        .select(`#next-placeholder${this.dataset[index].value}`).transition().duration(300).delay(index * 100).attr('opacity', 0).remove().end(),

      currentElement.transition().duration(300).delay(index * 100).style('opacity', 0).remove().end(),

      // Lots of math here to get this right.  Basically, we need to shift all remaining items to left after we remove
      // the selected item.   To do this we need to include any transformations by pan/zoom.  To start,  we compare the 
      // elements x difference to calculate the amount of shift.  This is difference is based on the D3 xScale function
      // and is dynamic.  This difference changes based on the amount of pan/zoom.  To offset x and y, we multiply the 
      // difference by the current scaled amount (stored in panScale) then subtract the panX and panY respectively.  
      // To prevent further scaling, we set the scale to 1.
      remainingElements
        .transition()
        .duration(300)
        .delay(400)
        .attr('transform', `translate(${(xDifference * this.panScale - this.panX) + this.panX},
                                        ${(yDifference * this.panScale - this.panY) + this.panY}) scale(1)`)
        .end()


      // remove node links

    ])
  }
  showAddLast() {
    let currentSVG = d3.select('#link-list-nodes')
    let index = this.currentValues.length;

    return Promise.all([
      currentSVG
        .append('rect')
        .attr('width', 40)
        .attr('height', 60)
        .attr('id', 'show-add-last')
        .attr('opacity', 0.75)
        .attr('fill', 'orange')
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
        .attr('transform', `translate(${this.panX},${this.panY}) scale(${this.panScale}, ${this.panScale})`)
        .attr('x', (d: any, i: any) => this.xScale(index.toString()))
        .remove()

    ])
  }
  displayLinks(defaultDuration: number) {
    let listToArray = this.linkedList.toLLNodeArray();
    let currentSVG = d3.selectAll('g.ll-group')

    //currentSVG.selectAll('.link').remove();

    currentSVG

      .append('line')
      .data(listToArray)
      .attr('class', 'link')
      .attr('id', (d: any, i: any) => 'line' + d.value)
      .attr('x1', (d: any, i: any) => this.xScale(i.toString()) + 33)
      .attr('y1', (d: any, i: any) => 155)
      .attr('stroke-width', 1)
      .attr('stroke', 'black')
      .attr('marker-end', `url(#arrowhead)`)
      .attr('x2', (d: any, i: any) => this.xScale(i.toString()) + 44)
      .attr('y2', (d: any, i: any) => 155)
      .attr('opacity', 1)
      .attr('transform', `translate(${this.panX},${this.panY}) scale(${this.panScale}, ${this.panScale})`)
      .transition()
      .duration(defaultDuration)
      .delay(200)
      .attr('opacity', 1)

  }
  ////UTILITY FUNCTIONS
  zoom(event: any) {

    d3.select('div#svg-linked-lists')
      .selectAll('text,rect,circle,line')
      .attr('transform', event.transform)

  }
  toggleButtons() {
    let buttons = document.querySelectorAll('button'); // Disable all the buttons
    if (this._buttons) {
      buttons.forEach((button) => {
        button.disabled = true;
        this._buttons = false;
      })
    }
    else {
      buttons.forEach((button) => {

        button.disabled = false;
        this._buttons = true;
      })
    }
  }
}
