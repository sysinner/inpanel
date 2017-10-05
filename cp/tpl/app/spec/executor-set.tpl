
<div id="incp-app-specset-executorset-p5-alert" class="alert alert-danger hide"></div>

<div id="incp-app-specset-executorset-p5">
    <div class="l4i-form-group">
      <label>Name</label>
      <p><input name="name" class="form-control" value="{[=it.name]}"></p>
    </div>

    <div class="l4i-form-group">
      <label>ExecStart</label>
      <textarea name="exec_start" class="form-control" rows="5">{[=it.exec_start]}</textarea>
    </div>

    <div class="l4i-form-group">
      <label>ExecStop</label>
      <textarea name="exec_stop" class="form-control" rows="3">{[=it.exec_stop]}</textarea>
    </div>
<!--
    <div class="l4i-form-group">
      <label>Priority (0 ~ 32)</label>
      <p><input name="priority" class="form-control" value="{[=it.priority]}"></p>
    </div>
-->
	<div class="l4i-form-group">
      <label>Plan</label>
      <p>
	    <select name="plan" class="form-control">
          <option value="on_boot" {[=it.plan.on_boot_selected]}>On Boot</option>	
          <option value="on_tick" {[=it.plan.on_tick_selected]}>On Tick</option>	
		</select>
	  </p>
    </div>

</div>
