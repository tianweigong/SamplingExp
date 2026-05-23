//default
const exp_id="planPot";
const ins_n_total=2; // include the setup, not include the comprehension check
var page_cur=0;
var comp_time=0;
var trial_start_time;
var ans_start_time;
var p_sti;
var finish_mod=0;
var mydata=new Array;
var mysample=new Array;
var myans=new Array;
const myABI=Math.random().toString(35).substring(2, 11)

var trial_num=-1;
var trial2_num=-1;
var sp_num;
var ne_num;
var nc_num;
var pr_e;
var pr_c;
var out_e;
var out_c;
var n_second=new Array;


const exp_start_time=Date.now();

const trial_total=36;
// const trial_total=1;
const trial_list=shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12,
													13,14,15,16,17,18,19,20,21,22,23,24,
													25,26,27,28,29,30,31,32,33,34,35])
const sti_power=shuffle(sti_power_all)
const sti_baserate=shuffle(sti_baserate_all).slice(0, trial_total)

const myCond=shuffle(["C","B","M"])[1]


var ctn_m;
var ctn_c;
var ctn_b;
//related to ins

function idpro_check(){
	if(document.getElementById("idpro").value==""){
		$('#btn_idpro').prop('disabled',true)
	}else{
	 $('#btn_idpro').prop('disabled',false)
	}
}

function idpro_show() {
	$('#pg_cons').css('display','none')
	$('#pg_idpro').css('display','block')
	window.scrollTo(0,0)
}

function ins_show() {
	$('#pg_idpro').css('display','none')
	$('#pg_ins').css('display','block')
	page_cur=1;
	$('#btn_backward').prop('disabled',true)

	if (myCond=="B"){
		$('#ins_type_C, #ins_type_M, #mid_type_C, #mid_type_M, #C_question_ctn, #M_question_ctn').css('display','none');

	}else if (myCond=="C"){
		$('#ins_type_B, #ins_type_M, #mid_type_B, #mid_type_M, #B_question_ctn, #M_question_ctn').css('display','none');

	}else if (myCond=="M"){
		$('#ins_type_C, #ins_type_B, #mid_type_C, #mid_type_B, #C_question_ctn, #B_question_ctn').css('display','none');
	}

	ctn_m = document.getElementById("M_question_ctn");
	ctn_c = document.getElementById("C_question_ctn");
	ctn_b = document.getElementById("B_question_ctn");
}


function ins_prev(){
	page_cur--;
	if (page_cur<=ins_n_total){
		$('#pg_ins'+page_cur).css('display','block')
		$('#pg_ins'+(page_cur+1)).css('display','none')
		$('#btn_backward').prop('disabled',false)
		$('#btn_forward').prop('disabled',false)
	}

	if (page_cur==1){
		$('#btn_backward').prop('disabled',true)
	}

	if (page_cur==ins_n_total+1){
		$('#pg_ins'+page_cur).css('display','block')
		$('#pg_again').css('display','none')
	}
}

function ins_next(){
	page_cur++;
	if (page_cur>1 & page_cur<=ins_n_total+1){
		$('#pg_ins'+page_cur).css('display','block')
		$('#pg_ins'+(page_cur-1)).css('display','none')
		$('#btn_backward').prop('disabled',false)
		$('#btn_forward').prop('disabled',false)
	}

	if (page_cur==ins_n_total+1){ //comprehension check page
		$('#btn_forward').prop('disabled',true)
		click_comprehension()
	}

	if (page_cur==ins_n_total+2){ //feecback
		comprehension_check()
	}

	if (page_cur==ins_n_total+3){ //start the experiment
		$('#pg_ins').css('display','none')
		$('#pg_game').css('display','block')
		my_trial()
	}
	window.scrollTo(0,0)
}

function click_comprehension(){

	var check_flag0= document.getElementById("check0_yes").checked || document.getElementById("check0_no").checked
	var check_flag1= document.getElementById("check1_yes").checked || document.getElementById("check1_no").checked
	var check_flag2= document.getElementById("check2_yes").checked || document.getElementById("check2_no").checked

	if (check_flag0&check_flag1&check_flag2){
		$('#btn_forward').prop('disabled',false)
	}
}

function comprehension_check(){
	comp_time++;
	var check_ans=[]

	var p=document.getElementById("check0_yes").checked

	p=p*document.getElementById("check1_no").checked
	p=p*document.getElementById("check2_yes").checked

	if (p){
		$('#pg_ins'+(ins_n_total+1)).css('display','none')
		window.scrollTo(0,0)
		$('#pg_nice').css('display','block')
		$('#btn_backward').prop('disabled',true)
	}else{
		$('#pg_ins'+(ins_n_total+1)).css('display','none')
		window.scrollTo(0,0)
		$('#pg_again').css('display','block')
		$('#btn_forward').prop('disabled',true)
	}
}

//trials
function ansRe(){
	var ans;
	if (myCond=="B"){
		if (document.getElementById("B0").checked){ans=0}
		if (document.getElementById("B1").checked){ans=1}
	}
	if (myCond=="C"){
		ans=document.getElementById("answer_slider").value
	}
	if (myCond=="M"){
		if (document.getElementById("M0").checked){ans=0}
		if (document.getElementById("M1").checked){ans=1}
		if (document.getElementById("M2").checked){ans=2}
	}
	return ans
}

function confRe(){
	var confans;
	if (document.getElementById("Conf0").checked){confans=0}
	if (document.getElementById("Conf1").checked){confans=1}
	if (document.getElementById("Conf2").checked){confans=2}
	return confans
}

function my_trial(){

	if (trial_num>(trial_total-1)){my_trial_two();return}

	$("#img_sti").attr("src","static/sti/outblank.png");
	$("#btn_test").prop('disabled',false);
	$("#btn_stop").prop('disabled',true);
	$("#btn_test").css('display','block');
	$("#btn_stop").css('display','block');
	$("#btn_answer").css('display','none');

	if (trial_num!=-1){
		mydata.push({"trial":trial_num,"cpow":sti_power[p_sti],"br":sti_baserate[p_sti],
			"sp_num":sp_num,"ne_num":ne_num,"nc_num":nc_num,
			"answer":ansRe(),"conf":confRe(),
			"trial_start_time":trial_start_time,
			"trial_end_time":Date.now()
		});
	}

	if (trial_num>=(trial_total-1)){
		$("#pg_game").css('display','none');
		$("#pg_secondround").css('display','block');
		return;
	}

	trial_num++;
	sp_num=0;
	ne_num=0;
	nc_num=0;

	p_sti=trial_list[trial_num];
	pr_e=sti_power[p_sti]+sti_baserate[p_sti]-sti_power[p_sti]*sti_baserate[p_sti];
	pr_c=sti_baserate[p_sti];
	
	hint_update();

	$("#progress_indicator").css('width',Number(100*trial_num/trial_total)+'%');
	// $("#prog_hint").html('Progress: '+trial_num+'/36');

	$('#B0,#B1,#M0,#M1,#M2,#Conf0,#Conf1,#Conf2').prop('checked', false);
	$("#answer_slider").removeClass('slider'); 
	$("#answer_slider").addClass('inact_slider');
	document.getElementById("answer_slider").value="50";
	$("#question_container").css('display','none');
	$('#conf_container').css('display','none');

	$("#hint_name").html("You are investigating solution "+slu_nam[trial_num]+" on plant "+pla_nam[trial_num])
	$("#B_question").html("Does solution "+slu_nam[trial_num]+" cause plant "+pla_nam[trial_num]+" to bloom?")
	$("#M_question").html("How much does solution "+slu_nam[trial_num]+" cause plant "+pla_nam[trial_num]+" to bloom?")
	$("#C_question").html("How much does solution "+slu_nam[trial_num]+" cause plant "+pla_nam[trial_num]+" to bloom? <br> (Make sure your estimate is covered by the black block.)")
  // $("#guide_container").html("Click 'Start' to watch the clip whenever you are ready")

  trial_start_time=Date.now()
}


function btn_test_click(){
	$("#btn_test").prop('disabled', true);
	$("#btn_stop").prop('disabled', true);

	if (Math.random() < pr_e){out_e=1}else{out_e=0}
	if (Math.random() < pr_c){out_c=1}else{out_c=0}
	
	sp_num++;
	ne_num=ne_num+out_e;
	nc_num=nc_num+out_c;

	mysample.push({"trial":trial_num,"cpow":sti_power[p_sti],"br":sti_baserate[p_sti],
			"sp_num":sp_num,"ne_num":ne_num,"nc_num":nc_num,"out_e":out_e,"out_c":out_c,"sample_time":Date.now()});

	$("#img_sti").attr("src","static/sti/outblank.png");

	setTimeout(showout,500) 

	if (sp_num<30){setTimeout(resample,1000)}else{
		$("#btn_stop").prop('disabled', false);
	}

}

function showout(){
	$("#img_sti").attr("src","static/sti/out"+out_e+out_c+".png");
	hint_update();
}

function resample(){
	$("#btn_test").prop('disabled', false);
	$("#btn_stop").prop('disabled', false);
}

function hint_update(){//sp_num,ne_num,nc_num
	$("#hint_sample").html("You have sampled "+sp_num+" time(s).");
	$("#hint_ne").html("There were "+ne_num+" case(s) of blooming under solution.");
	$("#hint_nc").html("There were "+nc_num+" case(s) of blooming under no solution.");
}

function btn_stop_click(){
	$("#btn_test").prop('disabled',true);
	$("#btn_stop").prop('disabled',true);
	$("#btn_test").css('display','none');
	$("#btn_stop").css('display','none');

	$("#question_container").css('display','block');
	ans_start_time=Date.now();
}


function btn_next_click() {
	$("#btn_answer").prop('disabled', true);
	window.scrollTo(0,0);
	my_trial();
}

function clickAns(){
	$("#answer_slider").removeClass('inact_slider'); 
	$("#answer_slider").addClass('slider');
	$("#conf_container").css('display','block');

	if (trial2_num==-1){
			myans.push({"trial":trial_num,"cpow":sti_power[p_sti],"br":sti_baserate[p_sti],
			"sp_num":sp_num,"ne_num":ne_num,"nc_num":nc_num,
			"ans":ansRe(),"mod":"answer",
			"ans_start_time":ans_start_time,"ans_end_time":Date.now()});
	}else{
			myans.push({"trial":trial_num,"cpow":sti_power[p_sti],"br":sti_baserate[p_sti],
			"sp_num":sp_num,"ne_num":ne_num,"nc_num":nc_num,
			"ans":ansRe2(),"mod":"answer",
			"ans_start_time":ans_start_time,"ans_end_time":Date.now()});
	}

}


function clickAnsConf(){ //for confidence
	$("#btn_answer").prop('disabled', false);
	$("#btn_answer").css('display','block');

	myans.push({"trial":trial_num,"cpow":sti_power[p_sti],"br":sti_baserate[p_sti],
			"sp_num":sp_num,"ne_num":ne_num,"nc_num":nc_num,
			"ans":confRe(),"mod":"confidence",
			"ans_start_time":ans_start_time,"ans_end_time":Date.now()});
}

function task_bye(){
	if (finish_mod==0){
		$("#pg_ques").css('display', 'none');
		$("#pg_bye").css('display', 'block');
		finish_mod=1
		SaveData(1)
	}
}


function ansRe2(){
	var ans;
	if (myCond=="C"){
			if (document.getElementById("B0").checked){ans=0}
			if (document.getElementById("B1").checked){ans=1}
	}else{
			ans=document.getElementById("answer_slider").value
	}

	return ans
}



function my_trial_two(){
	$("#question_container").css('display','block');
	$("#pg_game").css('display','block');
	$("#pg_secondround").css('display','none');
	$("#img_sti").attr("src","static/sti/outblank.png");

	n_second=Array.from({length: 36}, (_, i) => i);

	if (trial_num>(trial_total-1)){
		mydata.push({"trial":trial_num,"cpow":sti_power[p_sti],"br":sti_baserate[p_sti],
			"sp_num":sp_num,"ne_num":ne_num,"nc_num":nc_num,
			"answer":ansRe2(),"conf":confRe(),
			"trial_start_time":trial_start_time,
			"trial_end_time":Date.now()
		});
	}

	$("#btn_test").css('display','none');
	$("#btn_stop").css('display','none');
	$("#btn_answer").css('display','block');

	if (trial_num>=(trial_total+n_second.length-1)){
		$("#pg_game").css('display','none');
		$("#pg_ques").css('display','block');
		return;
	}

	trial_num++;
	trial2_num++;
	sp_num=mydata[n_second[trial2_num]].sp_num;
	ne_num=mydata[n_second[trial2_num]].ne_num;;
	nc_num=mydata[n_second[trial2_num]].nc_num;;

	p_sti=trial_list[n_second[trial2_num]];


	$("#img_sti").attr("src","static/sti/outblank.png");
	
	hint_update();

	$("#progress_indicator").css('width',Number(100*(trial_num-36)/trial_total)+'%');
	// $("#prog_hint").html('Progress: '+trial_num+'/36');


	$('#Conf0,#Conf1,#Conf2').prop('checked', false);
	$('#conf_container').css('display','none');

	$("#hint_name").html("You were investigating solution "+slu_nam[n_second[trial2_num]]+" on plant "+pla_nam[n_second[trial2_num]]+".")
	$("#B_question").html("Does solution "+slu_nam[n_second[trial2_num]]+" cause plant "+pla_nam[n_second[trial2_num]]+" to bloom?")
	$("#M_question").html("How much does solution "+slu_nam[n_second[trial2_num]]+" cause plant "+pla_nam[n_second[trial2_num]]+" to bloom?")
	$("#C_question").html("How much does solution "+slu_nam[n_second[trial2_num]]+" cause plant "+pla_nam[n_second[trial2_num]]+" to bloom? <br> (Make sure your estimate is covered by the black block.)")

	itf_update();

	trial_start_time=Date.now();
	ans_start_time=Date.now();
}

function itf_update(){
	$('#B_question_ctn,#C_question_ctn,#M_question_ctn').css('display','none');

	$('#second_hint').css('display','block');

	$('#current_sample').css('display','none');
	$('#divPlot').css('display','none');
	$("#hint_sample,#hint_ne,#hint_nc").css({"opacity": "0.5","pointer-events": "none"});

	if (myCond=="B"){
		$('#B_question_ctn,#C_question_ctn').css('display','block');
		ctn_c.parentNode.insertBefore(ctn_b, ctn_c);

		$('#B0,#B1').prop('checked', false);
		$('#B'+mydata[n_second[trial2_num]].answer).prop('checked', true)  
		$("#B_question_ctn").css({"opacity": "0.5","pointer-events": "none"});

		document.getElementById("answer_slider").value="50";
		$("#answer_slider").removeClass('slider'); 
		$("#answer_slider").addClass('inact_slider');


	}else if (myCond=="C"){
		$('#C_question_ctn,#B_question_ctn').css('display','block');
		ctn_b.parentNode.insertBefore(ctn_c, ctn_b);

		document.getElementById("answer_slider").value=mydata[n_second[trial2_num]].answer
		$("#answer_slider").removeClass('inact_slider'); 
		$("#answer_slider").addClass('slider');
		$("#C_question_ctn").css({"opacity": "0.5","pointer-events": "none"});

		$('#B0,#B1').prop('checked', false);

	}else if (myCond=="M"){
		$('#M_question_ctn,#C_question_ctn').css('display','block');
		ctn_c.parentNode.insertBefore(ctn_m, ctn_c);

		$('#M0,#M1,#M2').prop('checked', false);
		$('#M'+mydata[n_second[trial2_num]].answer).prop('checked', true)  
		$("#M_question_ctn").css({"opacity": "0.5","pointer-events": "none"});

		document.getElementById("answer_slider").value="50";
		$("#answer_slider").removeClass('slider'); 
		$("#answer_slider").addClass('inact_slider');
	}

}



const supabaseUrl =
  'https://tbbmhgkaxgxbxqomkqda.supabase.co';

const supabaseKey =
  'sb_publishable_SIQU4kSfgO8Vh_Fw75fQcg_lP0ARKr8';

const supabaseClient =
  supabase.createClient(
    supabaseUrl,
    supabaseKey
  );

async function SaveData(dbs){

	var feedback=document.getElementById("text_feedback").value;
	feedback=feedback.replace(/'/g,"\\'");
	feedback=feedback.replace(/"/g, '\\"');

	var age=document.getElementById("age").value;
	var e = document.getElementById("gender");
	var gender=e.options[e.selectedIndex].value;
	var idpro=document.getElementById("idpro").value;

	const exp_end_time=Date.now()

	if(dbs==0){
		var a = document.createElement("a");
		var file = new Blob([JSON.stringify(
			{exp:exp_id,
			participant_id:idpro+"_"+myABI+"_"+comp_time+"_"+exp_start_time+"_"+exp_end_time,
			age:age,
			gender:gender,
			feedback:feedback,
			data:JSON.stringify(mydata),
			sample:JSON.stringify(mysample),
			answers:JSON.stringify(myans)
		}
			)], 
			{type: "application/json"});
		a.href = URL.createObjectURL(file);
		a.download = 'myexpdata.json';
		a.click();
		return;
	}


	const result = await supabaseClient
    .from('experiment_data')
    .insert([
        {

            exp: exp_id,
            participant_id:
                idpro + "_" +
                myABI + "_" +
                comp_time + "_" +
                exp_start_time + "_" +
                exp_end_time,

            age: age,
            gender: gender,
            feedback: feedback,

            data: mydata,
            sample: mysample,
            answers: myans,

            user_agent: navigator.userAgent,

            screen_width: window.innerWidth,
            screen_height: window.innerHeight,

            timezone:
                Intl.DateTimeFormat()
                    .resolvedOptions()
                    .timeZone,

            language: navigator.language
        }
    ]);

if(result.error){

    console.error(result.error);

    $('#well_done').html("Oops!");
    $('#pg_upload').css('display','block');
    setTimeout(btn_upload_show,10000) 

}else{

    $('#well_done').html("");
    $('#pg_bye_good').css('display','block');
}


}

function finish_upload () {
	$('#pg_upload').css('display','none');
	$('#well_done').html("");
	$('#pg_bye_good').css('display','block');
}

function survey_check(){
	if (document.getElementById("gender_unselected").selected||document.getElementById("age").value==""){
	}else{
		$('#btn_finish').prop('disabled', false)
	}
}



function btn_upload_show(num){
	$('#btn_upload').prop('disabled', false)
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function randPerm(n) {
  var result = new Array(n)
  result[0] = 0
  for(var i=1; i<n; ++i) {
    var idx = (Math.random()*(i+1))|0
    if(idx < i) {
      result[i] = result[idx]
    }
    result[idx] = i
  }
  return result
}
