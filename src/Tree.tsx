
//import React, { Component } from 'react';
import * as React from "react";
import SortableTree from 'react-sortable-tree';

interface TreeProps {

}

interface TreeState {
  treeData: object;
}

export default class Tree extends React.Component<TreeProps, TreeState>  {
    constructor(props) {
        super(props);

        this.state = {
            treeData: [{"title":"fcuk","children":[{"title":"2tee2","subtitle":"XP: 1624 \r\n Join Date: 10/29/2016 16:41:03"},{"title":"Jaqueline","subtitle":"XP: 745 \r\n Join Date: 02/22/2017 14:16:12"},{"title":"BkeII","subtitle":"XP: 869 \r\n Join Date: 01/12/2017 02:05:31"},{"title":"scar78","subtitle":"XP: 1237 \r\n Join Date: 12/09/2016 18:53:06"},{"title":"ннн","subtitle":"XP: 590 \r\n Join Date: 03/05/2017 19:39:58"},{"title":"JuanMa","subtitle":"XP: 712 \r\n Join Date: 02/24/2017 02:00:32"},{"title":"lordroger","subtitle":"XP: 374 \r\n Join Date: 03/09/2017 04:45:36"},{"title":"Ramsses","subtitle":"XP: 1186 \r\n Join Date: 01/12/2017 02:38:42"},{"title":"Dragan","subtitle":"XP: 207 \r\n Join Date: 03/06/2017 16:22:36"},{"title":"Apollo Creed","subtitle":"XP: 928 \r\n Join Date: 12/04/2016 19:31:09"},{"title":"mim","subtitle":"XP: 341 \r\n Join Date: 03/04/2017 21:50:30"},{"title":"Desigur","subtitle":"XP: 598 \r\n Join Date: 02/27/2017 18:42:33"},{"title":"Quasar","subtitle":"XP: 1450 \r\n Join Date: 12/08/2016 16:56:06"},{"title":"kylo ren","subtitle":"XP: 465 \r\n Join Date: 03/06/2017 09:52:41"},{"title":"ariel","subtitle":"XP: 333 \r\n Join Date: 03/09/2017 08:18:48"},{"title":"bobzzz","subtitle":"XP: 382 \r\n Join Date: 03/09/2017 06:38:47"},{"title":"Alble002","subtitle":"XP: 284 \r\n Join Date: 03/07/2017 14:11:40"},{"title":"le voleur","subtitle":"XP: 214 \r\n Join Date: 03/12/2017 01:03:39"},{"title":"sithcoby","subtitle":"XP: 854 \r\n Join Date: 03/09/2017 06:09:51"},{"title":"figer","subtitle":"XP: 125 \r\n Join Date: 03/09/2017 08:26:47"},{"title":"4ваня4","subtitle":"XP: 255 \r\n Join Date: 03/04/2017 21:33:59"},{"title":"615008","subtitle":"XP: 401 \r\n Join Date: 03/10/2017 01:38:05"},{"title":"lewandowski","subtitle":"XP: 517 \r\n Join Date: 02/27/2017 18:36:40"},{"title":"Snowy","subtitle":"XP: 1078 \r\n Join Date: 02/04/2017 12:28:30"},{"title":"Commandent Kush","subtitle":"XP: 502 \r\n Join Date: 01/30/2017 22:45:25"},{"title":"Darth Goof","subtitle":"XP: 884 \r\n Join Date: 12/09/2016 18:52:55"},{"title":"Lófütyi","subtitle":"XP: 1064 \r\n Join Date: 02/07/2017 19:50:59"},{"title":"Darth Enego","subtitle":"XP: 1020 \r\n Join Date: 02/13/2017 19:45:06"},{"title":"emiliodominges","subtitle":"XP: 317 \r\n Join Date: 03/09/2017 05:45:01"},{"title":"bnb","subtitle":"XP: 517 \r\n Join Date: 03/09/2017 07:48:29"}]}]

        };
    }

    render() {
        return (
            <div style={{ height: 600 }}>
                <SortableTree
                    treeData={this.state.treeData}

                    onChange={treeData => this.setState({ treeData })}

                    on
                />
            </div>
        );
    }
}