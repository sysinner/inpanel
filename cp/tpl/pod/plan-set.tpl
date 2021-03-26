<style>
  .less-modal-body-pagelet #incp-podnew-form {
    padding-left: 4px;
  }
  #incp-podnew-form .btn-sm {
    padding: 3px 10px;
    font-size: 12px;
    line-height: 120%;
  }
  #incp-podnew-form button.icon-x20 {
    padding: 0px;
    width: 22px;
    height: 22px;
    font-size: 11px;
    text-align: center;
  }
</style>
<div id="incp-podnew-alert"></div>
<div id="incp-podnew-form"></div>

<script type="text/html" id="incp-podnew-modal">
  <table class="incp-formtable">
    <tbody>
      <tr id="incp-podnew-plan-row">
        <td width="180px">Plan</td>
        <td
          id="incp-podnew-plans"
          class="incp-form-box-selector"
          style="padding-bottom: 0"
        ></td>
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
  <span
    class="incp-form-box-selector-item {[if (v.meta.id == it._plan_selected) { ]}selected{[ } ]}"
    id="incp-podnew-plan-id-{[=v.meta.id]}"
    onclick="inCpPod.NewPlanChange('{[=v.meta.id]}')"
  >
    <div>{[=v.meta.name]}</div>
  </span>
  {[~]}
</script>

<script type="text/html" id="incp-podnew-resource-selector-tpl">
  <tr class="incp-podnew-resource-selector-row">
    <td>Zone / Cluster</td>
    <td
      class="incp-form-box-selector"
      id="incp-podnew-zones"
      style="padding-bottom:0"
    >
      {[~it._zones :v]} {[? v.name == it._zone_selected]} {[=v.zone_title]} /
      {[=v.cell_title]} {[?]} {[~]}
    </td>
  </tr>

  <tr class="incp-podnew-resource-selector-row">
    <td>CPU / RAM</td>
    <td
      class="incp-form-box-selector"
      id="incp-podnew-res-computes"
      style="padding-bottom:0"
    >
      {[~it.res_computes :v]}
      <div
        class="incp-font-fixspace incp-form-box-selector-item {[if (!inCpPod.NewOptionResFit(v)) {]}disable{[} else if (v.ref_id == it.res_compute_selected) { ]}selected{[ } ]}"
        id="incp-podnew-res-compute-id-{[=v.ref_id]}"
        onclick="inCpPod.NewPlanResComputeChange('{[=v.ref_id]}')"
      >
        <div>CPU {[=(v.cpu_limit/10).toFixed(1)]} cores</div>
        <div>RAM {[=inCp.UtilResSizeFormat(v.mem_limit * inCp.ByteMB)]}</div>
        <span class="disable_close">&times;</span>
      </div>
      {[~]}
    </td>
  </tr>

  <tr class="incp-podnew-resource-selector-row">
    <td>Image</td>
    <td
      class="incp-form-box-selector"
      id="incp-podnew-images"
      style="padding-bottom:0"
    >
      {[? it._options.app_runtime_images &&
      it._options.app_runtime_images.length > 0]}
      {[~it._options.app_runtime_images :ref_id]}
      <div
        class="incp-form-box-selector-item"
        id="incp-podnew-image-id-{[=valueui.utilx.cryptoMd5(ref_id)]}"
        onclick="inCpPod.NewPlanImageChange('{[=ref_id]}')"
      >
        <div>{[=ref_id]}</div>
      </div>
      {[~]} {[??]} {[~it.images :v]}
      <div
        class="incp-form-box-selector-item {[if (v.ref_id == it.image_selected) { ]}selected{[ } ]}"
        id="incp-podnew-image-id-{[=valueui.utilx.cryptoMd5(v.ref_id)]}"
        onclick="inCpPod.NewPlanImageChange('{[=v.ref_id]}')"
      >
        <div>{[? v.ref_title]}{[=v.ref_title]} / {[?]}{[=v.driver]}</div>
        <div>{[=v.ref_id]}</div>
      </div>
      {[~]} {[?]}
    </td>
  </tr>

  <tr class="incp-podnew-resource-selector-row">
    <td>System Storage</td>
    <td>
      <table class="incp-formtable">
        <tr>
          <td width="" valign="top">
            <strong>Size</strong>
            <div
              class="incp-form-box-selector form-inline"
              id="incp-podnew-res-volumes"
            ></div>
            <div
              class="form incp-form-box-selector-item-frame"
              id="incp-podnew-res-volumes"
            >
              <div class="input-group" style="">
                <input
                  type="text"
                  class="form-control"
                  id="incp-podnew-resource-value"
                  value="{[=it._res_volume._valued]}"
                  oninput="inCpPod.HookAccountChargeRefresh()"
                />

                <div class="input-group-append">
                  <div class="input-group-text">GB</div>
                </div>
              </div>
              <div class="form-text text-muted" id="incp-podnew-resource-hint">
                Range: {[=it._res_volume.request]} ~ {[=it._res_volume.limit]}
                GB
              </div>
            </div>
          </td>
          <td valign="top">
            <strong
              >Mounts
              <button
                class="btn btn-default icon-x20"
                onclick="inCpPod.SpecMountAppend()"
              >
                <i class="fa fa-plus"></i></button
            ></strong>
            <table class="">
              <tbody id="incp-pod-set-spec-mounts">
                <tr>
                  <td>Source</td>
                  <td>Target</td>
                </tr>
                {[~it._spec_mounts :v]}
                <tr class="incp-pod-set-spec-mount-item">
                  <td>
                    <input class="form-control form-control-sm" name="source"
                    value="{[=v.source]}" style="min-width:300px" {[? v.default
                    === true]} readonly{[?]} />
                  </td>
                  <td>
                    <input class="form-control form-control-sm" name="target"
                    value="{[=v.target]}" style="min-width:150px" {[? v.default
                    === true]} readonly{[?]} />
                  </td>
                  <td align="right">
                    {[? v.default !== true]}
                    <button
                      class="btn btn-default icon-x20"
                      onclick="inCpPod.SpecMountDelete()"
                    >
                      <i class="fa fa-times"></i>
                    </button>
                    {[?]}
                  </td>
                </tr>
                {[~]}
              </tbody>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</script>


<script type="text/html" id="incp-pod-set-spec-mount-item-tpl">
  <tr class="incp-pod-set-spec-mount-item">
    <td>
      <input class="form-control form-control-sm" name="source"
      value="{[=it.source]}" style="min-width:300px" {[?
        it.default === true]} readonly{[?]} />
    </td>
    <td>
      <input class="form-control form-control-sm" name="target"
      value="{[=it.target]}" style="min-width:150px" {[?
        it.default === true]} readonly{[?]} />
    </td>
    <td align="right">
      {[? it.default !== true]}
      <button
        class="btn btn-default icon-x20"
        onclick="inCpPod.SpecMountDelete()"
      >
        <i class="fa fa-times"></i>
      </button>
      {[?]}
    </td>
  </tr>
</script>