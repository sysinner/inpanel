<style>
.less-modal-body-pagelet #incp-podnew-form {
  padding-left: 4px;
}
</style>
<div id="incp-podnew-alert"></div>
<div id="incp-podnew-form"></div>

<script type="text/html" id="incp-podnew-inner">
<div class="panel panel-default card">
  <div class="panel-heading card-header">New Pod Instance</div>
  <div class="panel-body card-body">
    <div class="l4i-form-group">
      <label class="">Name</label>
      <div class="">
        <input type="text" class="form-control" id="incp-podnew-meta-name" value="">
      </div>
    </div>

    <div class="l4i-form-group">
      <label class="">Plan</label>
      <div id="incp-podnew-plans" class="incp-form-box-selector"></div>
    </div>

    <div id="incp-podnew-resource-selector"></div>

    <div class="l4i-form-group">
	  <div id="incp-podnew-charge-estimate-value" class="font-size:30px"></div>
	</div>

    <button type="button" class="pure-button pure-button-primary" onclick="inCpPod.NewCommit()">
      Save
    </button>

    <button type="button" class="pure-button" onclick="inCpPod.List()" style="margin-left:10px">
      Cancel
    </button>
  </div>
</div>
</script>

<script type="text/html" id="incp-podnew-modal">
<div class="l4i-form-group">
  <label class="">Name</label>
  <div class="">
    <input type="text" class="form-control" id="incp-podnew-meta-name" value="">
  </div>
</div>
<div class="l4i-form-group">
  <label class="">Plan</label>
  <div id="incp-podnew-plans" class="incp-form-box-selector"></div>
</div>
<div id="incp-podnew-resource-selector"></div>
<div class="l4i-form-group">
  <div id="incp-podnew-charge-estimate-value" class="font-size:30px"></div>
</div>
</script>

<script type="text/html" id="incp-podnew-plans-tpl">
{[~it.items :v]}
<div class="incp-form-box-selector-item {[if (v.meta.id == it._plan_selected) { ]}selected{[ } ]}" 
  id="incp-podnew-plan-id-{[=v.meta.id]}"
  onclick="inCpPod.NewPlanChange('{[=v.meta.id]}')">
  <div>{[=v.meta.name]}</div>
</div>
{[~]}
</script>

<script type="text/html" id="incp-podnew-resource-selector-tpl">

<div class="l4i-form-group">
  <label>Zone / Cluster</label>
  <div class="incp-form-box-selector" id="incp-podnew-zones">
    {[~it._zones :v]}
    <div class="incp-form-box-selector-item {[if (v.name == it._zone_selected) { ]}selected{[ } ]}" 
      id="incp-podnew-zone-id-{[=v.id]}"
      onclick="inCpPod.NewPlanClusterChange('{[=v.name]}')">
      <div>{[=v.zone_title]}</div>
      <div>{[=v.cell_title]}</div>
    </div>
    {[~]}
  </div>
</div>

<div class="l4i-form-group">
  <label>Resources</label>
  <div class="incp-form-box-selector" id="incp-podnew-res-computes">
    {[~it.res_computes :v]}
    <div class="incp-form-box-selector-item {[if (!inCpPod.NewOptionResFit(v)) {]}disable{[} else if (v.ref_id == it.res_compute_selected) { ]}selected{[ } ]}" 
      id="incp-podnew-res-compute-id-{[=v.ref_id]}"
      onclick="inCpPod.NewPlanResComputeChange('{[=v.ref_id]}')">
      <div>CPU: {[=v.cpu_limit]}m</div>
      <div>Memory: {[=inCp.UtilResSizeFormat(v.mem_limit)]}</div>
	  <span class="disable_close">&times;</span>
    </div>
    {[~]}
  </div>
</div>


<div class="l4i-form-group">
  <label>Image</label>
  <div class="incp-form-box-selector" id="incp-podnew-images">
    {[~it.images :v]}
    <div class="incp-form-box-selector-item {[if (v.ref_id == it.image_selected) { ]}selected{[ } ]}" 
      id="incp-podnew-image-id-{[=v.ref_id]}"
      onclick="inCpPod.NewPlanImageChange('{[=v.ref_id]}')">
      <div>{[=v.ref_id]}</div>
      <div>{[=v.driver]} / {[=v.os_dist]}</div>
    </div>
    {[~]}
  </div>
</div>

<div class="l4i-form-group">
  <label>System Storage</label>
  <div class="incp-form-box-selector form-inline" id="incp-podnew-res-volumes">

    <div class="input-group" style="width:200px;">
      <input type="text" class="form-control" id="incp-podnew-resource-value" value="{[=it._res_volume._valued]}">
      <span class="input-group-addon">GB</span>      
    </div>

    <div class="form-control-static" style="margin-left: 10px;">
      Range: {[=inCp.UtilResSizeFormat(it._res_volume.request)]} ~ {[=inCp.UtilResSizeFormat(it._res_volume.limit)]}
    </div>    

  </div>
</div>

</script>
