/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
    "use strict";

    import ISelectionId = powerbi.visuals.ISelectionId;

    export class MyVisual implements IVisual {
    
        private selectionIdBuilder: ISelectionIdBuilder;
        
        constructor(options: VisualConstructorOptions) {
            this.selectionIdBuilder = options.host.createSelectionIdBuilder();
        }
        public update(options: VisualUpdateOptions){

        }
    }

        
    export class Visual implements IVisual {
        private target: HTMLElement;
        private settings: VisualSettings;
        private textNode: Text;
        private tableData;
        private host:IVisualHost;
        private selectionManager: ISelectionManager;
        private menu;

        private indexIconURL=0;
        private indexBackgroundColor=1;
        private indexTitle=2;
        private indexPage=3;

        
        //private svg: d3.Selection<SVGElement>;

        constructor(options: VisualConstructorOptions) {
            this.host=options.host;
            this.selectionManager = options.host.createSelectionManager();
            // this.svg = d3.select(options.element)
            //     .append('svg')
            //     .classed('barChart', true);


            console.log('Visual constructor', options);
            this.target = options.element;
            this.tableData=null;
            if (typeof document !== "undefined") {
                this.rebuildVisual(null);
            }
        }

        public rebuildVisual(options: VisualUpdateOptions){
            this.target.innerHTML="";
            const new_p: HTMLElement = document.createElement("p");
            new_p.appendChild(document.createTextNode("Number or records:"));
            const new_em: HTMLElement = document.createElement("em");
            if (this.tableData!=null){
                this.textNode = document.createTextNode(this.tableData.length.toString());

            }
            else
                this.textNode = document.createTextNode("no data");
            new_em.appendChild(this.textNode);
            new_p.appendChild(new_em);
            this.target.appendChild(new_p);
    


            if (this.tableData){
                var numberOfElements=0;
                let dataViews = options.dataViews //options: VisualUpdateOptions
                let categorical = dataViews[0].categorical;
                let dataValues = categorical.values;

                this.menu=new Array();
console.log(JSON.stringify(categorical));
                for(let dataValue of dataValues) {
                    let values = dataValue.values;

                    for(let f = 0, len = dataValue.values.length; f < len; f++) {
                            //for(var f=0;f<this.tableData.length;f++){
                        var outDiv: HTMLDivElement = document.createElement("div");
                        outDiv.setAttribute("style","float:left;margin-right:10px;");
                        let selectionId = this.host.createSelectionIdBuilder()
                            .withCategory(categorical.categories[0], f)
                            .withMeasure(dataValue.source.queryName)
                            .withSeries(categorical.values, categorical.values[f])
                            .createSelectionId();
                        this.menu.push(selectionId);
                        outDiv.setAttribute("myid",numberOfElements.toString());
                        numberOfElements++;
                            
                        //Title,URL,color,nav
                        //THIS NEEDS TO BE CHANGED TO GATHER DATA FROM THE CORRECT COLUMNS
                        //URL, COLOR, TITLE, NAV
                        var imgBackgroundColor=this.tableData[f][this.indexBackgroundColor];
                        var imgURL=this.tableData[f][this.indexIconURL];
                        var textTitle=this.tableData[f][this.indexTitle];
                        var textNav=this.tableData[f][this.indexPage];
                        if (!imgURL)
                            imgURL="https://emeastackrplatformprd03.blob.core.windows.net/pbimages/menu-analysis.png";

                            //alert(imgBackgroundColor + " " + imgURL + " " + textTitle + " " + textNav)
                        var newElem= document.createElement("div");
                        newElem.setAttribute("style","margin-bottom:30px;width:112px;height:112px;background-color:" + imgBackgroundColor + ";white-space: nowrap;text-align: center;");
                    
                        var newSpan=document.createElement("span");
                        newSpan.setAttribute("style","display:inline-block;height:100%;vertical-align:middle;");
                        newElem.appendChild(newSpan);

                        const new_img: HTMLElement = document.createElement("img");
                        new_img.setAttribute("src",imgURL);
                        new_img.setAttribute("style","width:75px;height:75px;margin:0 auto;vertical-align:middle;");
                        newElem.appendChild(new_img);

                        var title:HTMLDivElement=document.createElement("div");
                        title.setAttribute("style","font:arial 10pt;width:112px;word-break:break-all;word-wrap:break-word;white-space:pre-wrap;margin-top:2px;");
                        title.textContent=textTitle;
                        newElem.appendChild(title);

                        outDiv.appendChild(newElem);


                        //HERE I'm adding a listener to CLICK
                        outDiv.addEventListener("click",d=>{ 
                            var myId=event.srcElement.parentElement.getAttribute("myid");
                            if (event.srcElement.tagName=="IMG")
                                myId=event.srcElement.parentElement.parentElement.getAttribute("myid");
                                this.selectionManager.select(this.menu[myId]);
                            });
                        
                        this.target.appendChild(outDiv);
                    }
                }
                //this.selectionManager.select(this.menu[0]);
            }      
        }

        public update(options: VisualUpdateOptions) {
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            console.log('Visual update', options);
            for (var f=0;f<options.dataViews[0].table.columns.length;f++)
            {
                //JUST BECAUSE IT'S A DEMO :)
                if (!options.dataViews[0].table.columns[f].isMeasure){
                    var a:any=options.dataViews[0].table.columns[f].identityExprs[0];
                    var b=a.ref;
                    if (b.indexOf("URL")>=0) {this.indexIconURL=f;}
                    if (b.indexOf("Title")>=0) {this.indexTitle=f;}
                    if (b.indexOf("Color")>=0) {this.indexBackgroundColor=f;}
                    if (b.indexOf("Page")>=0) {this.indexPage=f;}
                }
            }//URL,TITLE,COLOR,PAGEACCESS,TITLE
            this.tableData=options.dataViews[0].table.rows;
            //alert(JSON.stringify(this.tableData));
            this.rebuildVisual(options);
        }


        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }


        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}