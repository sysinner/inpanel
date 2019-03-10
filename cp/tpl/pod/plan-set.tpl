<style>
.less-modal-body-pagelet #incp-podnew-form {
  padding-left: 4px;
}
</style>
<div id="incp-podnew-alert"></div>
<div id="incp-podnew-form"></div>

<script type="text/html" id="incp-podnew-modal">
<table class="incp-formtable">
<tbody>

<tr id="incp-podnew-plan-row">
  <td width="180px">Plan</td>
  <td id="incp-podnew-plans" class="incp-form-box-selector" style="padding-bottom: 0">
  </td>
</tr>

<tr>
  <td>Cost of running</td>
  <td>
    <div id="incp-podnew-charge-estimate-value"></div>
  </td>
</tr>

</tbody>
</table>
</script>

<script type="text/html" id="incp-podnew-plans-tpl">
{[~it.items :v]}
<span class="incp-form-box-selector-item {[if (v.meta.id == it._plan_selected) { ]}selected{[ } ]}" 
  id="incp-podnew-plan-id-{[=v.meta.id]}"
  onclick="inCpPod.NewPlanChange('{[=v.meta.id]}')">
  <div>{[=v.meta.name]}</div>
</span>
{[~]}
</script>

<script type="text/html" id="incp-podnew-resource-selector-tpl">
<!-- TODO
<tr class="incp-podnew-resource-selector-row">
  <td>Zone / Cluster</td>
  <td class="incp-form-box-selector" id="incp-podnew-zones" style="padding-bottom:0">
    {[~it._zones :v]}
    <div class="incp-form-box-selector-item {[if (v.name == it._zone_selected) { ]}selected{[ } ]}" 
      id="incp-podnew-zone-id-{[=v.id]}"
      onclick="inCpPod.NewPlanClusterChange('{[=v.name]}')">
      <div>{[=v.zone_title]}</div>
      <div>{[=v.cell_title]}</div>
    </div>
    {[~]}
  </td>
</tr>
-->

<tr class="incp-podnew-resource-selector-row">
  <td>Resources</td>
  <td class="incp-form-box-selector" id="incp-podnew-res-computes" style="padding-bottom:0">
    {[~it.res_computes :v]}
    <div class="incp-font-fixspace incp-form-box-selector-item {[if (!inCpPod.NewOptionResFit(v)) {]}disable{[} else if (v.ref_id == it.res_compute_selected) { ]}selected{[ } ]}" 
      id="incp-podnew-res-compute-id-{[=v.ref_id]}"
      onclick="inCpPod.NewPlanResComputeChange('{[=v.ref_id]}')">
      <div>CPU {[=(v.cpu_limit/10).toFixed(1)]} Cores</div>
      <div>RAM {[=inCp.UtilResSizeFormat(v.mem_limit * inCp.ByteMB)]}</div>
    <span class="disable_close">&times;</span>
    </div>
    {[~]}
  </td>
</tr>

<!-- TODO
<tr class="incp-podnew-resource-selector-row">
  <td>Image</td>
  <td class="incp-form-box-selector" id="incp-podnew-images" style="padding-bottom:0">
    {[~it.images :v]}
    <div class="incp-form-box-selector-item {[if (v.ref_id == it.image_selected) { ]}selected{[ } ]}" 
      id="incp-podnew-image-id-{[=l4iString.CryptoMd5(v.ref_id)]}"
      onclick="inCpPod.NewPlanImageChange('{[=v.ref_id]}')">
      <div>{[=v.ref_id]}</div>
      <div>{[=v.driver]} / {[=v.os_dist]}</div>
    </div>
    {[~]}
  </td>
</tr>
-->

<tr class="incp-podnew-resource-selector-row">
  <td>System Storage</td>
  <td>
  <div class="incp-form-box-selector form-inline" id="incp-podnew-res-volumes">
    <div class="input-group" style="width:300px;">
      <input type="text" class="form-control" id="incp-podnew-resource-value" value="{[=it._res_volume._valued]}" oninput="inCpPod.HookAccountChargeRefresh()">
      <div class="input-group-append"><div class="input-group-text">GB</div></div>
    </div>
    <div class="form-text text-muted">
      Range: {[=it._res_volume.request]} ~ {[=it._res_volume.limit]} GB
    </div>    
  </div>
  </td>
</tr>

</script>
