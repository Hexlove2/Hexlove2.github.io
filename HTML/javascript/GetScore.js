var TypeA;
var TypeB;
var Lcount,Hcount,Gcount;
Lcount=0;
Hcount=0;
Gcount=0;
var LM =[-1,-1,-1,-1];

var HM =[-1,-1,-1,-1];

var GM =[-1,-1,-1,-1];


var LMF=[-1,-1,-1,-1];

var HMF = [-1,-1,-1,-1];

var GMF = [-1,-1,-1,-1];

var LPoint,GPoint;
LPoint=GPoint=0;
function getTypeA(Type)
{
    if(Type==='LA')
    {
        TypeA='L';
        //alert("目标类型是LA");
    }
    if(Type==='HA')
    {
        TypeA='H';
        //alert("目标类型是HA");
    }
    if(Type==='GA')
    {
        TypeA='G';
        //alert("目标类型是GA");
    }
}

function getTypeB(Type)
{
    if(Type==='LB')
    {
        TypeB='L';
        //alert("结算类型是LB");
    }
    if(Type==='HB')
    {
        TypeB='H';
        //alert("结算类型是HB");
    }
    if(Type==='GB')
    {
        TypeB='G';
        //alert("结算类型是GB");
    }
}

function getLcount(Type)
{
    if(Type=='LM[0]')
    {
        LM[0]=-LM[0];
    }
    if(Type=='LM[1]')
    {
        LM[1]=-LM[1];
    }
    if(Type=='LM[2]')
    {
        LM[2]=-LM[2];
    }
    if(Type=='LM[3]')
    {
        LM[3]=-LM[3];
    }
    if(Type=='LMF[0]')
    {
        LMF[0]=-LMF[0];
    }
    if(Type=='LMF[1]')
    {
        LMF[1]=-LMF[1];
    }
    if(Type=='LMF[2]')
    {
        LMF[2]=-LMF[2];
    }
    if(Type=='LMF[3]')
    {
        LMF[3]=-LMF[3];
    }
    //alert(LM[0].toString()+LMF[0].toString());
}

function getHcount(Type)
{
    if(Type=='HM[0]')
    {
        HM[0]=-HM[0];
    }
    if(Type=='HM[1]')
    {
        HM[1]=-HM[1];
    }
    if(Type=='HM[2]')
    {
        HM[2]=-HM[2];
    }
    if(Type=='HM[3]')
    {
        HM[3]=-HM[3];
    }
    if(Type=='HMF[0]')
    {
        HMF[0]=-HMF[0];
    }
    if(Type=='HMF[1]')
    {
        HMF[1]=-HMF[1];
    }
    if(Type=='HMF[2]')
    {
        HMF[2]=-HMF[2];
    }
    if(Type=='HMF[3]')
    {
        HMF[3]=-HMF[3];
    }
    //alert(HM[0].toString()+HMF[0].toString());
}

function getGcount(Type)
{
    if(Type=='GM[0]')
    {
        GM[0]=-GM[0];
    }
    if(Type=='GM[1]')
    {
        GM[1]=-GM[1];
    }
    if(Type=='GM[2]')
    {
        GM[2]=-GM[2];
    }
    if(Type=='GM[3]')
    {
        GM[3]=-GM[3];
    }
    if(Type=='GMF[0]')
    {
        GMF[0]=-GMF[0];
    }
    if(Type=='GMF[1]')
    {
        GMF[1]=-GMF[1];
    }
    if(Type=='GMF[2]')
    {
        GMF[2]=-GMF[2];
    }
    if(Type=='GMF[3]')
    {
        GMF[3]=-GMF[3];
    }
    //alert(GM[0].toString()+GMF[0].toString());
}

function GetPoint()
{
    if(TypeA==undefined||TypeB==undefined)
        alert("类型未选中");
    else
    {
        //alert("开始");
        if(TypeA=='L'&&TypeB=='L')
        {
            var DebuffA;
            for(let i=0;i<4;i++)
           {
               if(LM[i]>0)
               {
                   if(LMF[i]>0)
                       LPoint=LPoint+1.5 * 1.2;
                   else
                       DebuffA=true;
               }
               else if(LMF[i]>0)
               {
                    LPoint=LPoint+1.5;
               }

               if(HMF[i]>0)
               {
                   LPoint=LPoint+0.5;
                   GPoint=GPoint+0.4;
               }

               if(GMF[i]>0)
               {
                   GPoint=GPoint+1;
               }
           }
            if(DebuffA)
            LPoint= LPoint*0.9;
            //alert(LPoint.toString()+" "+GPoint.toString());
        }
        else if(TypeA=='L'&&TypeB=='H')
        {
           for(let i=0;i<4;i++)
           {
               if(LMF[i]>0)
               {
                   LPoint=LPoint+1.5;
               }
               if(HMF[i]>0)
               {
                   LPoint=LPoint+0.5;
                   GPoint=GPoint+0.4;
               }

               if(GMF[i]>0)
               {
                   GPoint=GPoint+1;
               }
           }
            LPoint= LPoint*0.8;
            //alert(LPoint.toString()+" "+GPoint.toString());
        }
        else if(TypeA=='L'&&TypeB=='G')
        {
            for(let i=0;i<4;i++)
            {
                if(LMF[i]>0)
                {
                    LPoint=LPoint+1.5;
                }
                if(HMF[i]>0)
                {
                    LPoint=LPoint+0.5;
                    GPoint=GPoint+0.4;
                }

                if(GMF[i]>0)
                {
                    GPoint=GPoint+1;
                }
            }
            LPoint= LPoint*0.8;
            //alert(LPoint.toString()+" "+GPoint.toString());
        }
        else if(TypeA=='H')
        {
            var DebuffA;
            for(let i=0;i<4;i++)
            {

            if(LMF[i]>0)
            {
                LPoint=LPoint+1.5;
            }
            if(HM[i]>0)
            {
                if(HMF[i]<0)
                {
                    DebuffA=true;
                }
            }
            if(HMF[i]>0)
            {
                Hcount++;
            }

            if(GMF[i]>0)
            {
                GPoint=GPoint+1;
            }

            }
            if(DebuffA)
            {
                GPoint=GPoint+Hcount*0.4*0.9;
                LPoint=LPoint+Hcount*0.5*0.9;
            }
            else
            {
                GPoint=GPoint+Hcount*0.4;
                LPoint=LPoint+Hcount*0.5;
            }
            //alert(LPoint.toString()+" "+GPoint.toString());
        }
        else if(TypeA=='G')
        {
            for (let i = 0; i < 4; i++)
            {
                if(LMF[i]>0)
                {
                    LPoint=LPoint+1.5;
                }
                if(HM[i]>0)
                {
                    GPoint=GPoint+0.4;
                    LPoint=LPoint+0.5;
                }
                if(GMF[i]>0)
                {
                    GPoint=GPoint+1;
                }
            }
            if(TypeB=='G')
                GPoint=GPoint*1.1;
            else
            {

            }
            //alert(LPoint.toString()+" "+GPoint.toString());
        }
    }
    //更新得分情况
    var LiP=document.getElementById("lixing2");
    var GiP=document.getElementById("ganxing2");
    LiP.innerHTML="理性分："+LPoint.toString();
    GiP.innerHTML="感性分："+GPoint.toString();

}