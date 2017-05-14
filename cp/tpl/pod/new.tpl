<div id="loscp-podnew-alert"></div>

<div class="panel panel-default">
  <div class="panel-heading">New Pod Instance</div>
  <div class="panel-body">

    <div class="l4i-form-group">
      <label class="">Name</label>
      <div class="">
        <input type="text" class="form-control" id="loscp-podnew-meta-name" value="">
      </div>
    </div>

    <div class="l4i-form-group">
      <label class="">Plan</label>
      <div id="loscp-podnew-plans" class="loscp-form-box-selector"></div>
    </div>

    <div id="loscp-podnew-resource-selector"></div>

    <button type="button" class="pure-button pure-button-primary" onclick="losCpPod.NewCommit()">
      Save
    </button>

    <button type="button" class="pure-button" onclick="losCpPod.List()" style="margin-left:10px">
      Cancel
    </button>

  </div>
</div>

<script type="text/html" id="loscp-podnew-plans-tpl">
{[~it.items :v]}
<div class="loscp-form-box-selector-item {[if (v.meta.id == it._plan_selected) { ]}selected{[ } ]}" 
  id="loscp-podnew-plan-id-{[=v.meta.id]}"
  onclick="losCpPod.NewPlanChange('{[=v.meta.id]}')">
  <div>{[=v.meta.title]}</div>
</div>
{[~]}
</script>

<script type="text/html" id="loscp-podnew-resource-selector-tpl">

<div class="l4i-form-group">
  <label>Zone / Cluster</label>
  <div class="loscp-form-box-selector" id="loscp-podnew-zones">
    {[~it._zones :v]}
    <div class="loscp-form-box-selector-item {[if (v.name == it._zone_selected) { ]}selected{[ } ]}" 
      id="loscp-podnew-zone-id-{[=v.id]}"
      onclick="losCpPod.NewPlanClusterChange('{[=v.name]}')">
      <div>{[=v.zone_title]}</div>
      <div>{[=v.cell_title]}</div>
    </div>
    {[~]}
  </div>
</div>

<div class="l4i-form-group">
  <label>Resources</label>
  <div class="loscp-form-box-selector" id="loscp-podnew-resource-computes">
    {[~it.res_computes :v]}
    <div class="loscp-form-box-selector-item {[if (v.meta.id == it.res_compute_selected) { ]}selected{[ } ]}" 
      id="loscp-podnew-resource-compute-id-{[=v.meta.id]}"
      onclick="losCpPod.NewPlanResComputeChange('{[=v.meta.id]}')">
      <div>CPU: {[=v.cpu_limit]}m</div>
      <div>Memory: {[=losCp.UtilResSizeFormat(v.memory_limit)]}</div>
    </div>
    {[~]}
  </div>
</div>


<div class="l4i-form-group">
  <label>Image</label>
  <div class="loscp-form-box-selector" id="loscp-podnew-images">
    {[~it.images :v]}
    <div class="loscp-form-box-selector-item {[if (v.meta.id == it.image_selected) { ]}selected{[ } ]}" 
      id="loscp-podnew-image-id-{[=v.meta.id]}"
      onclick="losCpPod.NewPlanImageChange('{[=v.meta.id]}')">
      <div>{[=v.driver]} / {[=v.os_name]}</div>
    </div>
    {[~]}
  </div>
</div>

<div class="l4i-form-group">
  <label>System Storage</label>
  <div class="loscp-form-box-selector form-inline" id="loscp-podnew-resource-volumes">

    <div class="input-group" style="width:200px;">
      <input type="text" class="form-control" id="loscp-podnew-resource-value" value="{[=it._res_volume._valued]}">
      <span class="input-group-addon">GB</span>      
    </div>

    <div class="form-control-static" style="margin-left: 10px;">
      Range: {[=losCp.UtilResSizeFormat(it._res_volume.request)]} ~ {[=losCp.UtilResSizeFormat(it._res_volume.limit)]}
    </div>    

  </div>
</div>

</script>
