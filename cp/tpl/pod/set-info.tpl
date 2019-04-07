<div id="incp-podsetinfo-alert"></div>

<div id="incp-podsetinfo">  

<input type="hidden" name="meta_id" value="{[=it.pod.meta.id]}">

<table class="incp-formtable">

<tr>
  <td width="200px">Name</td>
  <td>
    <input type="text" class="form-control" name="meta_name" value="{[=it.pod.meta.name]}">
  </td>
</tr>

<!--
<tr>
  <td>Spec</td>
  <td>
    <div class="input-group mb-3">
      <input type="text" class="form-control " value="{[=it._spec_summary]}" readonly>
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" onclick="inCpPod.SpecSet('{[=it.pod.meta.id]}')">Change Spec</button>
      </div>
    </div>
  </td>
</tr>
-->


<tr>
  <td>State</td>
  <td>
    <div class="">
      <select name="operate_exp_sys_state" class="form-control">
      {[~it._op_sys_states :v]}
        <option value="{[=v.value]}" {[if (it.pod.operate.exp_sys_state == v.value) {]} selected{[}]}>{[=v.title]}</option>
      {[~]}
      </select>
    </div>
  </td>
</tr>

{[if (inCp.syscfg.zone_master.multi_replica_enable) {]}
{[if (it._op_rep_min <= it._op_rep_max) {]}
<tr>
  <td>Number of Replica</td>
  <td>
    <input type="text" class="form-control" name="operate_replica_cap" value="{[=it.pod.operate.replica_cap]}">
	<small>Limit from {[=it._op_rep_min]} to {[=it._op_rep_max]}</small>
  </td>
</tr>
{[}]}
{[}]}


<tr>
  <td>Control</td>
  <td>
    <div class="">
    {[~it._op_actions :v]}
      <span class="incp-form-checkbox checkbox-inline">
        <input type="radio" name="operate_action" value="{[=v.action]}" {[ if (v.active) { ]}checked="checked"{[ } ]}> {[=v.title]}
      </span>
    {[~]}
    </div>
  </td>
</tr>

</table>

</div>
